from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import re
import os

load_dotenv()

k = os.getenv("OPENAI_API_KEY")
client = OpenAI()

app = Flask(__name__)
CORS(app)


def analyze_privacy(pages):
    # return {"message": "gpt-summary", "summary" : "This is a summary of the privacy policy"}
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
        final_response = client.chat.completions.create(
            model="gpt-4o-mini-2024-07-18",
            messages=[
                {"role": "user", 
                "content": "Here are the summaries of the privacy policies: " + str(summaries) + "please use them to inform the user about their privacy choices on this site and if they shouldnt use this site for tracing reasons or any other security issues. Raise any red flags necessary. Give the answer back in HTML and format different sections wiht headers instead of numbering."},
            ],               
        )
        print("final response:", final_response.choices[0].message.content)
        text_answer = final_response.choices[0].message.content.replace("```", "")

        html_pattern = r"<!DOCTYPE html><html>*?</html>"
        t = re.search(html_pattern, text_answer, re.DOTALL)

        soup = BeautifulSoup(text_answer, 'html.parser')
        text_answer = soup.prettify()

    except Exception as e:
        print(f"Error in creating the final response: {e}")
        return jsonify({"message": "Error creating the final response"}), 500

    return {"message": "gpt-summary", "summary" : text_answer}

        

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
    print("response:", response)
    
    return response
    
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
        
        # #print("links to analyze:", linksToAnalyze)
        response_message = cleanUpHtml(htmlToAnalyze)

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
    
   
    