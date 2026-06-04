from fastapi import FastAPI

app = FastAPI(title='KinMind AI Edge Server')

@app.get('/')
def read_root():
    return {'message': 'Welcome to the KinMind AI Edge Server!'}

