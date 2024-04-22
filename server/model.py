from sentence_transformers import SentenceTransformer
from user_models import UploadedFile
import os
import docx2txt
from app import db
from lshashpy3 import LSHash

model = SentenceTransformer("all-MiniLM-L6-v2")

hasher = LSHash(hash_size=64, input_dim=384, num_hashtables=6,
    storage_config={ 'dict': None },
    matrices_filename='weights.npz', 
    hashtable_filename='hash.npz'
)

SIMILARITY_THRESHOLD = 0.8

sentences = {}

def _get_sentences(path: os.PathLike):
    ext = path.split(".")[-1]
    if ext == "docx":
        with open(path, 'rb') as infile:
            doc = docx2txt.process(infile)
    elif ext == "txt":
        with open(path, 'rb') as infile:
            doc = infile.read()
    return [sentence for sentence in doc.split('. ') if len(sentence) > 15]

def add_file_to_db(path, class_id, student_id):
    text = _get_sentences(path)
    embeddings = model.encode(text, convert_to_tensor=True).numpy()

    fileobj = UploadedFile(student_id=student_id, class_id=class_id, embedding=embeddings.tobytes(), path=path)
    db.session.add(fileobj)
    db.session.commit()

    for i, sentence in enumerate(text):
        hasher.index(embeddings[i], extra_data={"sentence": sentence, "pos": i, "file_id": fileobj.id, "student_id": fileobj.student_id})
    hasher.save()

def find_matches(file: UploadedFile):
    matches = []
    for emb in file.embedding:
        emb_sim = []
        for ((vec, extra), similarity) in hasher.query(emb, num_results=3, distance_func="cosine"):
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