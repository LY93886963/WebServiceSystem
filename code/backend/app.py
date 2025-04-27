from flask import Flask, request, jsonify
import pymysql

app = Flask(__name__)


db_config = {
    'host': '123.56.94.39',
    'user': 'cs2202',
    'password': 'abcd',
    'database': 'cs'
}


def get_db_connection():
    connection = pymysql.connect(
        host=db_config['host'],
        user=db_config['user'],
        password=db_config['password'],
        database=db_config['database'],
        port=db_config['port']
    )
    return connection



if __name__ == '__main__':
    app.run(debug=True)
