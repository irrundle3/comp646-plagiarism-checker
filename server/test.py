import numpy as np
from annoy import AnnoyIndex
import re
from sentence_transformers import SentenceTransformer
import pandas as pd

model = SentenceTransformer("all-MiniLM-L6-v2")

test = np.array([[1,2,3],[4,5,6]])
test = test.tobytes()
test = np.frombuffer(test)
print(test.reshape(-1, 3))

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
print(embeddings.dtype)
print(embeddings)
embeddings = embeddings.tobytes()
embeddings = np.frombuffer(embeddings, dtype="float32").reshape((-1, 384))
print(embeddings)
for i, emb in enumerate(embeddings):
    extra_data.loc[len(extra_data.index)] = [text[i], i, 4, 4]
    annoy.add_item(annoy.get_n_items(), emb)
    if i % 20 == 0:
        print(i, "/", len(embeddings))

sentence = "While I could do something differently for my own benefit, I would rather, as a politician, do the right thing, which is a rare occasion for those like us."
res = model.encode(sentence, convert_to_numpy=True)
annoy.build(10, n_jobs=-1)

idx, sim = annoy.get_nns_by_vector(res, 10, include_distances=True)
print(text[idx[0]], text[idx[1]], text[idx[2]])
print(extra_data["sentence"][idx[0]])
print(sim)

