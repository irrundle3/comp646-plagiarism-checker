from sentence_transformers import SentenceTransformer, util
from preprocessing import get_text
import torch
import re

model = SentenceTransformer("all-MiniLM-L6-v2")

sentences = {}

def add_file_to_db(username, class_id, document):
    
    text = get_text(username, class_id, document)
    if username not in sentences:
        sentences[username] = {}
    if class_id not in sentences[username]:
        sentences[username][class_id] = {}
    if document not in sentences[username][class_id]:
        sentences[username][class_id][document] = [s for s in re.split(r'\n|\.', text) if len(s) > 15] # Cleans data a bit
    print(sentences)

def find_matches(username, class_id, document):
    text = get_text(username, class_id, document)
    input_sentences = [s for s in re.split(r'\n|\.', text) if len(s) > 15]
    embeddings = model.encode(input_sentences, convert_to_tensor=True)
    other_sentences = []
    scores = []
    for t_username in sentences.keys():
        if t_username != username:
            for t_class_id in sentences[t_username].keys():
                for t_document in sentences[t_username][t_class_id].keys():
                    temp_sentences = sentences[t_username][t_class_id][t_document]
                    temp_embeddings = model.encode(temp_sentences, convert_to_tensor=True)
                    cosine_scores = util.cos_sim(embeddings, temp_embeddings)
                    scores.append(cosine_scores)
                    other_sentences += temp_sentences
    if not scores:
        return {sentence: [] for sentence in input_sentences}
    scores = torch.cat(scores, dim=1)
    result = {}
    for idx, sentence in enumerate(input_sentences):
        top = torch.topk(scores[idx], k=3) # top indices
        similarities = ([other_sentences[idx] for idx in top[1]], top[0])
        result[sentence] = []
        for t1, t0 in zip(similarities[0], similarities[1]):
            if t0 > 0.2:
                result[sentence] = [t1, t0.item()]
        if len(result[sentence]) > 0:
            print(sentence, result[sentence])
    return result
        
                    
                    
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