# text_file https://www.kaggle.com/datasets/nbroad/persaude-corpus-2/data
# cnn https://www.kaggle.com/datasets/hadasu92/cnn-articles-after-basic-cleaning

import pandas as pd
import os
import atexit
import glob
import requests

CNN = True
ESSAYS = False

def clean():
    for filename in glob.glob("text_file_*"):
        os.remove(filename)
    for filename in glob.glob("cnn_*"):
        os.remove(filename)

# Read the CSV file (replace 'your_file.csv' with your actual file path)
csv_file = 'essay_db.csv'
csv_file2 = 'articles.csv'
atexit.register(clean)
df = pd.read_csv(csv_file)
df2 = pd.read_csv(csv_file2)

# Assuming the third column is indexed as 2 (adjust if needed)
third_column = df["full_text"]
cnn_column = df2["Article text"]
# print(third_column)

files = []
# Create a text file for each value in the third column
for i, value in enumerate(third_column[:600]):
    filename = f'text_file_{i}.txt'
    files.append(filename)
    with open(filename, 'w') as txt_file:
        txt_file.write(str(value))
        
for i, value in enumerate(cnn_column[:600]):
    filename = f'cnn_{i}.txt'
    files.append(filename)
    with open(filename, 'w') as txt_file:
        txt_file.write(str(value))


class_id = int(input("Class id: "))
if ESSAYS:
    for i in range(100,130):
        files2 = {'file': open(f'text_file_{i}.txt','rb')}
        values = {"student_username": "ianrundle", "class_id":1}
        r = requests.post("http://localhost:3000/api/student/document/upload", files=files2, data=values)
        
    for i in range(500,530):
        files2 = {'file': open(f'text_file_{i}.txt','rb')}
        values = {"student_username": "ianrundle2", "class_id":1}
        r = requests.post("http://localhost:3000/api/student/document/upload", files=files2, data=values)
        
if CNN:
    for i in range(100,130):
        files2 = {'file': open(f'cnn_{i}.txt','rb')}
        values = {"student_username": "ianrundle", "class_id":1}
        r = requests.post("http://localhost:3000/api/student/document/upload", files=files2, data=values)
        
    for i in range(500,530):
        files2 = {'file': open(f'cnn_{i}.txt','rb')}
        values = {"student_username": "ianrundle2", "class_id":1}
        r = requests.post("http://localhost:3000/api/student/document/upload", files=files2, data=values)