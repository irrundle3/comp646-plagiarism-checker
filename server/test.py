import numpy as np
from annoy import AnnoyIndex
import re
from sentence_transformers import SentenceTransformer
import pandas as pd

model = SentenceTransformer("all-MiniLM-L6-v2")

text = []
with open("text.txt") as file:
    text = file.read()
    text = re.split(r"\n|(\. )", text)
    print("stripping text")
    text = [s.strip() for s in text if s not in (". ", None, "") and len(s) > 20][:500]
    print("encoding text")
    embeddings = model.encode(text, convert_to_numpy=True)
    print(text)

annoy = AnnoyIndex(384, "dot")
extra_data = pd.DataFrame(columns=["sentence", "pos", "file_id", "student_id"])


print(len(embeddings), "embeddings")
for i, emb in enumerate(embeddings):
    extra_data.loc[len(extra_data.index)] = [text[i], i, 4, 4]
    annoy.add_item(annoy.get_n_items(), emb)
    if i % 20 == 0:
        print(i, "/", len(embeddings))

sentence = "I can make a selfish decision and do something that is different, but I’m doing here what I believe to be the right thing."
res = model.encode(sentence, convert_to_numpy=True)
annoy.build(10, n_jobs=-1)

idx, sim = annoy.get_nns_by_vector(res, 10, include_distances=True)
print(text[idx[0]])
print(extra_data[idx[0]].sentence)


