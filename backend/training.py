import re

def fixFile(file):
    content = ""
    with open(file, 'r') as f:
        content = f.read()
        #print(content)

    content = content.replace("message", "messages")
    with open(file, 'w') as f:
        f.write(content)
        print("File was fixed.")
        



def main():
    fixFile("training-data.jsonl")

if __name__ == "__main__":
    main()