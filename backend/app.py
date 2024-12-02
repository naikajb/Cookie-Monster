from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import time
import re
import os

load_dotenv()

k = os.getenv("OPENAI_API_KEY")
client = OpenAI()

app = Flask(__name__)
CORS(app)
summary = ""
whatToAnalyze = []

def analyze_privacy(pages):
    # print("Analyzing privacy...")
    # time.sleep(10)
    #return {"message": "gpt-summary", "summary" : "This is the main summary of the policies"}
    print("Analyzing privacy...")
    summaries = []
    
    for item in pages:
        try: 
            prompt = f"Can you summarize the privacy policy in a way that will help the user make informed choices about their privacy? Here is the privacy policy for this page: {item}."
            
            response = client.chat.completions.create(
                model="gpt-4o-mini-2024-07-18",
                messages=[
                    {"role": "system", 
                    "content": "You are a helpful assistant."
                    },
                    {"role": "user", 
                    "content": prompt},
                ],               
            )

            summary = response.choices[0].message.content
            summaries.append(summary)
            #print("summary:", summary)
        except Exception as e:
            print(f"Error in analyzing privacy: {e}")
            return jsonify({"message": "Error in analyzing privacy"}), 500
        
        #print("item:", item, "\n--------------------------------------------------------")
        #break
    try:
        print("Creating the final response...")

        # defines the format of the answer returned by the model
        response_format = {"type": "json_schema", 
                           "json_schema": 
                                            {
                                            "name": "points_schema",
                                            "strict": True,
                                            "schema": {
                                                "type": "object",
                                                "properties": {
                                                "overall_text": {
                                                    "type": "string",
                                                    "description": "quick summary of the privacy analysis.",
                                                    
                                                },
                                                "good_points": {
                                                    "type": "array",
                                                    "description": "A list of positive aspects or advantages.",
                                                    "items": {
                                                    "type": "string",
                                                    "description": "A positive aspect."
                                                    }
                                                },
                                                "bad_points": {
                                                    "type": "array",
                                                    "description": "A list of negative aspects or disadvantages.",
                                                    "items": {
                                                    "type": "string",
                                                    "description": "A negative aspect."
                                                    }
                                                }
                                                },
                                                "required": [
                                                "overall_text",
                                                "good_points",
                                                "bad_points"
                                                ],
                                                "additionalProperties": False
                                            
                                            }
                    }
        }

        final_response = client.chat.completions.create(
            model="ft:gpt-4o-mini-2024-07-18:personal:training:AZ0ojPQJ",
            response_format=response_format,
            messages=[
                {"role": "user", 
                "content": "Here are the summaries of the privacy policies: " + str(summaries) + ". Classify your answer giving the good and bad points as well as an overall summary text. The overall summary text needs to be 150 words maximum. There could be only bad points, only good points, or both. If there are no good or bad points, please write 'None'."},
            ],               
        )
        #print("final response:", final_response.choices[0].message.content)
        json_answer = final_response.choices[0].message.content


    except Exception as e:
        print(f"Error in creating the final response: {e}")
        return jsonify({"message": "Error creating the final response"}), 500

    return json_answer 

        
# this function removes the html tags  and just extracts the text from the html and then calls the analyze_privacy function
def cleanUpHtml(htmlToAnalyze):
    print("Cleaning up HTML...")
    privacy_text_from_pages = []
    

    #print (htmlToAnalyze[0])
    for page in htmlToAnalyze:
        #print ("page:", page)
        soup = BeautifulSoup(page, 'html.parser')
        body_text = soup.find("body").text

        for a_tag in soup.find_all('a'):
            a_tag.decompose()
        for scripts in soup.find_all('script'):
            scripts.decompose()
        for style in soup.find_all('style'):
            style.decompose()
        for meta in soup.find_all('meta'):
            meta.decompose()
        for nav in soup.find_all('nav'):
            nav.decompose()
        for footer in soup.find_all('footer'):
            footer.decompose()
        for search in soup.find_all('search-container'):
            search.decompose() 
        for header in soup.find_all('h1, h2, h3, h4, h5, h6'):
            header.decompose()
        #privacy_text_from_pages.append(str(soup))
        t = soup.get_text()
        t = re.sub(r'\s+', ' ', t)
        privacy_text_from_pages.append(t)
       
    print("HTML was cleaned up. Text now being analyzed...")
    response = analyze_privacy(privacy_text_from_pages)
    #print("response:", response)
    
    return response


@app.route('/get-privacy', methods=['GET'])
def get_privacy():
    print("get privacy: i am here")
    #print("what to analyze:", whatToAnalyze)
    response_message = cleanUpHtml(whatToAnalyze)
    return response_message, 200

@app.route('/receive-content', methods=['POST'])
def receive_content():
    print("receive content: i am here")
    try:
        data = request.json
        #print("data:", data.)
        privacy_data = data.get("privacyContent", [])
        #print(len(privacy_data))

        response_message = {"message" : "Content received successfuly in back end", "received_content": privacy_data}

        htmlToAnalyze = []
        linksToAnalyze = []

        #build array of the content to analyze
        for item in privacy_data: 
            link  = item.get("link")
            linksToAnalyze.append(link)

            content = item.get("content")
            #print("link:", link)
            text = item.get("text")
            htmlToAnalyze.append(content)
            whatToAnalyze.append(content)
        
        
        #print("what to analyze:", whatToAnalyze)
        # #print("links to analyze:", linksToAnalyze)
        #response_message = cleanUpHtml(htmlToAnalyze)
        #summary = response_message["summary"]

        #analyze the content
       # analyzed_content = analyze_privacy(linksToAnalyze)
        return jsonify(response_message), 200
    

    except Exception as e:
        print("Error in receiving content:", str(e))
        return jsonify({"message": "Error in receiving content"}), 500
    
def main():
    print("main: i am here")

if __name__ == "__main__":
    app.run(port=5001, debug=True)
    
   
    