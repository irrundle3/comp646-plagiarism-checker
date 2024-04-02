import docx2txt
import glob
import os

def to_txt(path: os.PathLike):
    if path.split(".")[-1] == "docx":
        with open(path, 'rb') as infile:
            with open(os.path.join(os.path.dirname(path), '.' + os.path.basename(path)[:-5] + '.txt'), 'w', encoding='utf-8') as outfile:
                doc = docx2txt.process(infile)
                outfile.write(doc)
                print("processed")
                
def path_to_txt(path: os.PathLike):
    print(path)
    if path.split(".")[-1] == "docx":
        return os.path.dirname(path) + '/.' + os.path.basename(path)[:-5] + '.txt'
    elif path.split(".")[-1] == "txt":
        return path
    return None

def get_text(username, class_id, document):
    text_path = path_to_txt(f"user_files/{username}_files/{class_id}/{document}")
    if (text_path is not None) and (not os.path.isfile(text_path)): raise Exception("File not found.")
    with open(text_path) as file:
        text = file.read()
    return text