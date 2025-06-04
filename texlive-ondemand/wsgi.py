from gevent.pywsgi import WSGIServer
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app

http_server = WSGIServer(('0.0.0.0', 5002), app)
http_server.serve_forever()
