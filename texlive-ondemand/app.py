from flask import Flask, send_file, make_response, send_from_directory
from threading import Lock
import time
import os.path
import pykpathsea_pdftex
from flask_cors import cross_origin
import re
import os

app = Flask(__name__)

regex = re.compile(r'[^a-zA-Z0-9 _\-\.]')

def san(name):
    return regex.sub('', name)


@app.route('/pdftex/<int:fileformat>/<filename>')
@cross_origin()
def pdftex_fetch_file(fileformat, filename):
    filename = san(filename)
    url = None
    if filename == "neopdftex.fmt":
        url = os.path.abspath(os.path.join(os.path.dirname(__file__), filename))
    else:
        url = pykpathsea_pdftex.find_file(filename, fileformat)

    if url is None:
        return {"detail": "url was None"}, 404
    elif not os.path.isfile(url):
        return {"detail": f"file not found: {url}"}, 404
    else:
        response = make_response(send_file(url, mimetype='application/octet-stream'))
        response.headers['fileid'] = os.path.basename(url)
        response.headers['Access-Control-Expose-Headers'] = 'fileid'
        return response
            
@app.route('/debug/list')
def debug_list():
    files = os.listdir(os.path.dirname(__file__))
    return {"files": files}

@app.route('/pdftex/pk/<int:dpi>/<filename>')
@cross_origin()
def pdftex_fetch_pk(dpi, filename):
    filename = san(filename)
    
    url = pykpathsea_pdftex.find_pk(filename, dpi)

    if url is None or not os.path.isfile(url):
        return "File not found", 301
    else:
        response = make_response(send_file(url, mimetype='application/octet-stream'))
        response.headers['pkid'] = os.path.basename(url)
        response.headers['Access-Control-Expose-Headers'] = 'pkid'
        return response




