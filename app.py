from flask import Flask, render_template, make_response, request , jsonify
from PIL import Image
import os , io , sys
import numpy as np 
import cv2
import base64

from utils.imgProcess import imgProcess

app = Flask(__name__)


@app.route('/process', methods=['POST'])
def process():
    img_b64encode = request.form.get('image')
    img_b64decode = base64.b64decode(img_b64encode)  # base64解码
    npimg = np.frombuffer(img_b64decode,np.uint8) # 转换np序列
    img = cv2.imdecode(npimg,cv2.IMREAD_COLOR)
    ######### Do preprocessing here ################
    algorithm = request.form.getlist('algorithm')
    print(algorithm)
    b_th = request.form.get('b:th')
    print(b_th)
    # img = imgProcess(img, algorithm)
    ################################################
    img = cv2.imencode('.jpeg', img)[1]
    img_base64 = base64.b64encode(img)
    return jsonify({'status':str(img_base64)})


@app.after_request
def after_request(response):
    print("log: setting cors" , file = sys.stderr)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response

@app.route('/test', methods=['POST'])
def test():
    algorithm = request.form.getlist('algorithm')
    # hello = request.form.getlist('hello')
    print(algorithm)
    b_th = request.form.get('b:th')
    print(b_th)
    return render_template('test.html')

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)