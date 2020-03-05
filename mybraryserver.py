from flask import Flask, render_template, request, jsonify, json
import requests
from bs4 import  BeautifulSoup
from pymongo import MongoClient

client = MongoClient('localhost', 27017)
db = client.mybraryDB
app = Flask(__name__)

@app.route('/')
def home():
    return render_template('mybrary.html')

@app.route('/add', methods=['POST'])
def add_library():
    url_receive = request.form['url_give']
    memo_receive = request.form['memo_give']
    tag_receive = request.form['tag_give']

    # BeautifulSoup으로 github페이지 들어가서 이름, readme 긁어오기

    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get(url_receive, headers=headers)

    #html을 라이브러리 활용해서 검색용이하게.
    library_object = BeautifulSoup(data.text, 'html.parser')
    library_name = library_object.select('h1.public > strong > a')[0].text
    library_desc = library_object.select('.f4 > span' )[0].text
    library = {
        'name' : library_name,
        'url' : url_receive,
        'memo' : memo_receive,
        'tag' : tag_receive,
        'description' : library_desc
    }
    db.libraries.insert_one(library);
    return jsonify({'result':'success', 'msg':'ADD SUCCESS'})

@app.route('/loadmain', methods=['GET'])
def load_main():
    libraries = list(db.libraries.find({},{'_id':0}))

    return jsonify({'result':'success','libraries':libraries})

@app.route('/deletecard', methods=['POST'])
def delete_card():
    name_receive = request.form['card_name_give']
    db.libraries.delete_one({'name':name_receive})

    return jsonify({'result':'success'});

if __name__ == '__main__':
    app.run('127.0.0.1',port=5000,debug=True)