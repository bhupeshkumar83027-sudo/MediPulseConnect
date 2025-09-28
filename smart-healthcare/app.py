from flask import Flask, request, render_template, jsonify
import requests
import os

app = Flask(__name__)

# Chatbase config — ये values अपना workspace / Bot से वाला इस्तेमाल करो
CHATBASE_API_URL = "https://www.chatbase.co/api/v1/chat"
CHATBASE_API_KEY = os.environ.get("CHATBASE_API_KEY", "v302zmv2wis2zwq6gn99b1m7dxvhlt86")
CHATBOT_ID = os.environ.get("CHATBOT_ID", "5pf832nZZJFnf_fPGX1bI")  # आपका Bot ID

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    user_message = data.get("message", "")
    if not user_message:
        return jsonify({"reply": "No message provided."}), 400

    # Prepare payload as per Chatbase API docs
    payload = {
        "messages": [
            {"role": "user", "content": user_message}
        ],
        "chatbotId": CHATBOT_ID
        # आप optional fields जैसे model, stream, temperature आदि भी भेज सकते हो
    }
    headers = {
        "Authorization": f"Bearer {CHATBASE_API_KEY}",
        "Content-Type": "application/json"
    }

    try:
        resp = requests.post(CHATBASE_API_URL, headers=headers, json=payload, timeout=15)
        if resp.status_code == 200:
            resp_json = resp.json()
            # resp_json structure documentation के हिसाब से होनी चाहिए
            # assume response has "messages" array or "text" field
            # मैं assume कर रहा हूँ resp_json["messages"][0]["content"]
            if "messages" in resp_json and len(resp_json["messages"]) > 0:
                bot_reply = resp_json["messages"][0].get("content", "No content in reply.")
            elif "text" in resp_json:
                bot_reply = resp_json.get("text")
            else:
                bot_reply = "Reply format unknown."
        else:
            bot_reply = f"Error {resp.status_code}: {resp.text}"
    except Exception as e:
        bot_reply = f"Exception: {str(e)}"

    return jsonify({"reply": bot_reply})

if __name__ == "__main__":
    # port वो choose करो जो काम करता हो (जैसे 6060)
    app.run(host="127.0.0.1", port=6060, debug=True)
