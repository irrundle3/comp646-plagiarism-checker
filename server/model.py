from sentence_transformers import SentenceTransformer
from user_models import UploadedFile
import os
import docx2txt
from app import db
from annoy import AnnoyIndex
import re
import numpy as np
import pandas as pd

model = SentenceTransformer("all-MiniLM-L6-v2")

annoy = AnnoyIndex(384, "dot")
sentences = []
poses = []
file_ids = []
student_ids = []

SIMILARITY_THRESHOLD = 0.8
CHUNK_INTERVAL = 10 # Num words each chunk shifts
CHUNK_LENGTH = 50 # Num words in a chunk

def _index_sentence(embedding, sentence, pos, file_id, student_id):
    global sentences, poses, file_ids, student_ids, annoy
    sentences.append(sentence)
    poses.append(pos)
    file_ids.append(file_id)
    student_ids.append(student_id)
    annoy.add_item(annoy.get_n_items(), embedding)

def build_similarity_search():
    global annoy, sentences, poses, file_ids, student_ids
    annoy = AnnoyIndex(384, "dot")
    sentences, poses, file_ids, student_ids = [], [], [], []
    for file in UploadedFile.query.all():
        embeddings = np.frombuffer(file.embedding).reshape(-1, 384)
        sentences2 = get_sentences(file.path)
        for i, emb in enumerate(embeddings):
            _index_sentence(emb, sentences2[i], i, file.id, file.student_id)
    annoy.build(10, n_jobs=-1) # Uses all cpus possible

def read_doc(path: os.PathLike):
    ext = path.split(".")[-1]
    if ext == "docx":
        with open(path, 'rb') as infile:
            doc = docx2txt.process(infile)
    elif ext == "txt":
        with open(path, 'r') as infile:
            doc = infile.read()
    return doc

def get_sentences(path: os.PathLike):
    doc = read_doc(path)
    doc = doc.replace("\n", " ").split(" ")
    chunks = []
    for i in range(0, len(doc), CHUNK_INTERVAL):
        chunks.append(" ".join(doc[i:min(i+CHUNK_LENGTH,len(doc))]))
        if i+CHUNK_LENGTH >= len(doc):
            break
    return chunks


def get_file_data(path: os.PathLike):
    file = UploadedFile.query.filter_by(path = path).first()
    return {"student_id": file.student_id, "embedding": np.frombuffer(file.embedding)}

def add_file_to_db(path, class_id, student_id):
    text = get_sentences(path)
    embeddings = model.encode(text, convert_to_numpy=True)
    fileobj = UploadedFile(student_id=student_id, class_id=class_id, embedding=embeddings.tobytes(), path=path)
    db.session.add(fileobj)
    db.session.commit()
    build_similarity_search()


def find_matches(path: os.PathLike):
    file = UploadedFile.query.filter_by(path = path).first()
    matches = []
    data = np.frombuffer(file.embedding).reshape(-1, 384)
    for emb in data:
        emb_sim = []
        for id, distance in zip(*annoy.get_nns_by_vector(emb, 2, include_distances=True)):
            # if distance < SIMILARITY_THRESHOLD:
            #     break
            # if extra_data["student_id"][id] != file.student_id:
            emb_sim.append(f"{distance} : {sentences[id]}")
        matches.append("\n".join(emb_sim))
        break
    return "\n" + "\n".join(matches)
                    
                    
# sentence_embeddings = model.encode(sentences, convert_to_tensor=True)
# print(sentence_embeddings.shape)

# cosine_scores = util.cos_sim(sentence_embeddings, sentence_embeddings)
# print(cosine_scores)

# # Gets the top 10 matching sentences
# paraphrases = util.paraphrase_mining(
#     model, 
#     sentences, 
#     corpus_chunk_size=len(sentences), 
#     top_k=10
# )

# print(paraphrases)