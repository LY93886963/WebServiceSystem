from flask import Flask, render_template, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

app = Flask(__name__, 
            static_folder="../frontend/dist",
            static_url_path="/",
            template_folder="../frontend/dist")

# 启用CORS
CORS(app)

@app.route('/')
def index():
    """返回前端首页"""
    return app.send_static_file('index.html')

@app.route('/api/timeline/config')
def timeline_config():
    """返回时间轴配置信息"""
    timeline_config = {
        'embed_url': 'https://cdn.knightlab.com/libs/timeline3/latest/embed/index.html?source=v2:2PACX-1vSn1D7R-DPMPyh_8mCPoXM0nTP2UiPFB1g8UUYkZEEREb1OmPp4Cwq6d_9Se7XbM7uVV8f3FSjw1l-F&font=Default&lang=en&initial_zoom=2&height=650',
        'title': '博物馆文物时间轴',
        'description': '展示博物馆珍贵文物的历史时间线'
    }
    return jsonify(timeline_config)

@app.errorhandler(404)
def not_found(e):
    """处理404错误，返回前端路由"""
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) 