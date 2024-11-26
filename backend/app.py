from flask import Flask, request, jsonify
from flask_cors import CORS
from google.cloud import language_v1
import os


os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'config/credentials.json'

app = Flask(__name__)
CORS(app)
client = language_v1.LanguageServiceClient()

def analyze_privacy(text):
    
    document = language_v1.Document(content=text[1], type_=language_v1.Document.Type.HTML)
    response = client.analyze_entity_sentiment(request={'document': document})
    for entity in response.entities: 
        print("Entity: ", entity.name)
        print("Sentiment: ", entity.sentiment.score)
        print("Salience: ", entity.salience)
        print("-----------------")
    return response

@app.route('/receive-content', methods=['POST'])
def receive_content():
    try:
        data = request.json
        privacy_data = data.get("privacyContent", [])

        response_message = {"message" : "Content received successfuly in back end", "received_content": data}

        textToAnalyze = []
        linksToAnalyze = []

        #build array of the content to analyze
        for item in privacy_data: 
            
            link  = item.get("link")
            linksToAnalyze.append(link)

            content = item.get("content")
            print("link:", link)
            text = item.get("text")
            textToAnalyze.append(content)

        #analyze the content
        analyzed_content = analyze_privacy(linksToAnalyze)
        
        

        return jsonify(response_message), 200
    except Exception as e:
        print("Error in receiving content:", str(e))
        return jsonify({"message": "Error in receiving content"}), 500
    
def main():
    print("main: i am here")

if __name__ == "__main__":
    app.run(port=5001, debug=True)
    
   
    