from sentence_transformers import SentenceTransformer
from user_models import UploadedFile
import os
import docx2txt
from app import db
from lshashpy3 import LSHash
import re
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")

hasher = LSHash(hash_size=4, input_dim=384, num_hashtables=1,
    storage_config={ 'dict': None },
    # matrices_filename='weights.npz', 
    # hashtable_filename='hash.npz'
)

SIMILARITY_THRESHOLD = 0.8

def get_sentences(path: os.PathLike, filter=True):
    ext = path.split(".")[-1]
    if ext == "docx":
        with open(path, 'rb') as infile:
            doc = docx2txt.process(infile)
    elif ext == "txt":
        with open(path, 'r') as infile:
            doc = infile.read()
    if filter:
        return [sentence for sentence in re.split(r'\n|\. ', doc) if len(sentence) > 15]
    return re.split(r'\n|\. ', doc)

def get_file_data(path: os.PathLike):
    file = UploadedFile.query.filter_by(path = path).first()
    return {"student_id": file.student_id, "embedding": np.frombuffer(file.embedding)}

def add_file_to_db(path, class_id, student_id):
    text = get_sentences(path)
    embeddings = model.encode(text, convert_to_tensor=True)
    print(embeddings.shape)
    embeddings = embeddings.numpy()
    print(embeddings.shape)

    fileobj = UploadedFile(student_id=student_id, class_id=class_id, embedding=embeddings.tobytes(), path=path)
    db.session.add(fileobj)
    db.session.commit()

    for i, sentence in enumerate(text):
        print(embeddings[i].shape)
        hasher.index(embeddings[i], extra_data={"sentence": sentence, "pos": i, "file_id": fileobj.id, "student_id": fileobj.student_id})
    hasher.save()

def find_matches(path: os.PathLike):
    file = UploadedFile.query.filter_by(path = path).first()
    matches = []
    data = np.frombuffer(file.embedding).reshape(-1, 384)
    for emb in data:
        print(emb.shape)
        emb_sim = []
        print(hasher.query(emb, num_results=2, distance_func="cosine"))
        for ((vec, extra), similarity) in hasher.query(emb, num_results=2, distance_func="cosine"):
            if extra["student_id"] != file.student_id and similarity > SIMILARITY_THRESHOLD:
                emb_sim.append(extra)
        matches.append(emb_sim)
    return matches
                    
                    
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