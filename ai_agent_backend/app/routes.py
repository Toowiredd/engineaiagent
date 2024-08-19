from flask import request, jsonify
from flask_restful import Resource, abort
from functools import wraps
import jwt
from datetime import datetime, timedelta
from .models import db, User, Model, Task

# Secret key for JWT
SECRET_KEY = 'your-secret-key'  # In production, use a secure secret key

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            abort(401, message='Token is missing')
        try:
            data = jwt.decode(token.split()[1], SECRET_KEY, algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['user_id']).first()
        except:
            abort(401, message='Token is invalid')
        return f(current_user, *args, **kwargs)
    return decorated

class ModelsList(Resource):
    @token_required
    def get(current_user):
        models = Model.query.all()
        return {"models": [{"id": model.id, "name": model.name, "description": model.description} for model in models]}, 200

class ModelDetail(Resource):
    @token_required
    def get(current_user, model_id):
        model = Model.query.get_or_404(model_id)
        return {
            "id": model.id,
            "name": model.name,
            "description": model.description,
            "capabilities": model.capabilities
        }, 200

class CreateTask(Resource):
    @token_required
    def post(current_user):
        data = request.get_json()
        if not data or 'modelId' not in data or 'taskType' not in data or 'inputData' not in data:
            abort(400, message="Missing required fields")
        
        model = Model.query.get_or_404(data['modelId'])
        
        new_task = Task(
            model_id=model.id,
            user_id=current_user.id,
            task_type=data['taskType'],
            input_data=data['inputData']
        )
        
        db.session.add(new_task)
        db.session.commit()
        
        return {
            "taskId": new_task.id,
            "modelId": new_task.model_id,
            "taskType": new_task.task_type,
            "inputData": new_task.input_data,
            "status": new_task.status,
            "created_at": new_task.created_at.isoformat()
        }, 201

class TaskList(Resource):
    @token_required
    def get(current_user):
        tasks = Task.query.filter_by(user_id=current_user.id).all()
        return {"tasks": [{
            "taskId": task.id,
            "modelId": task.model_id,
            "taskType": task.task_type,
            "status": task.status,
            "created_at": task.created_at.isoformat()
        } for task in tasks]}, 200

class TaskDetail(Resource):
    @token_required
    def get(current_user, task_id):
        task = Task.query.filter_by(id=task_id, user_id=current_user.id).first_or_404()
        return {
            "taskId": task.id,
            "modelId": task.model_id,
            "taskType": task.task_type,
            "inputData": task.input_data,
            "status": task.status,
            "result": task.result,
            "created_at": task.created_at.isoformat(),
            "updated_at": task.updated_at.isoformat()
        }, 200

class GetToken(Resource):
    def post(self):
        data = request.get_json()
        if not data or 'username' not in data or 'password' not in data:
            abort(400, message="Missing username or password")
        
        user = User.query.filter_by(username=data['username']).first()
        if user and user.password_hash == data['password']:  # In production, use proper password hashing
            token = jwt.encode({
                'user_id': user.id,
                'exp': datetime.utcnow() + timedelta(hours=1)
            }, SECRET_KEY, algorithm="HS256")
            return jsonify({'token': token})
        
        abort(401, message="Invalid username or password")

class RegisterUser(Resource):
    def post(self):
        data = request.get_json()
        if not data or 'username' not in data or 'password' not in data or 'email' not in data:
            abort(400, message="Missing required fields")
        
        existing_user = User.query.filter_by(username=data['username']).first()
        if existing_user:
            abort(400, message="Username already exists")
        
        new_user = User(username=data['username'], email=data['email'], password_hash=data['password'])
        db.session.add(new_user)
        db.session.commit()
        
        return {"message": "User registered successfully"}, 201

def initialize_routes(api):
    api.add_resource(ModelsList, '/models')
    api.add_resource(ModelDetail, '/models/<string:model_id>')
    api.add_resource(CreateTask, '/tasks')
    api.add_resource(TaskList, '/tasks')
    api.add_resource(TaskDetail, '/tasks/<int:task_id>')
    api.add_resource(GetToken, '/get_token')
    api.add_resource(RegisterUser, '/register')