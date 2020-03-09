from flask import Flask, render_template, request, jsonify, json
import requests
from bs4 import  BeautifulSoup
from pymongo import MongoClient

client = MongoClient('localhost', 27017)
db = client.mybraryDB

app = Flask(__name__)
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}


@app.route('/')
def home():
    return render_template('mybrary.html')

@app.route('/add', methods=['POST'])
def add_library():
    url_receive = request.form['url_give']
    memo_receive = request.form['memo_give']
    tag_receive = request.form['tag_give']

    #tag #별로 구분하기.
    tags = tag_receive.split("#")
    tags = tags[1:len(tags)]

    for tag in tags:
        Ntag = tag.strip();
        tags[tags.index(tag)] = Ntag

    print(tags);
    tags_index = []
    #tag별로 tagdb에 삽입하기.
    for tag in tags:
        if(db.tags.find_one({'name':tag}) is None):
            db.tags.insert_one({'name':tag});
        tags_index.append(db.tags.find_one({'name':tag})['_id']) #index array로 저장

    # BeautifulSoup으로 github페이지 들어가서 이름, readme 긁어오기

    data = requests.get(url_receive, headers=headers)

    #html을 라이브러리 활용해서 검색용이하게.
    library_object = BeautifulSoup(data.text, 'html.parser')
    library_name = library_object.select('h1.public > strong > a')[0].text
    library_desc = library_object.select('.f4 > span' )[0].text
    library = {
        'name' : library_name,
        'url' : url_receive,
        'memo' : memo_receive,
        'tag' : tags_index,
        'description' : library_desc
    }
    db.libraries.insert_one(library);
    return jsonify({'result':'success', 'msg':'ADD SUCCESS'})

@app.route('/loadmain', methods=['GET'])
def load_main():
    libraries = list(db.libraries.find({},{'_id':0}))

    for library in libraries:
        tag_name = []
        for tag in library['tag']:
            tag_name.append(db.tags.find_one({'_id':tag} )['name'])
        library['tag'] = tag_name

    return jsonify({'result':'success','libraries':libraries})

@app.route('/deletecard', methods=['POST'])
def delete_card():
    name_receive = request.form['card_name_give']
    db.libraries.delete_one({'name':name_receive})

    return jsonify({'result':'success'});

if __name__ == '__main__':
    app.run('127.0.0.1',port=5000,debug=True)