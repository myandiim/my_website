from flask import Flask, render_template, request, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SECRET_KEY'] = 'change-this-secret'

db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Service(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    link = db.Column(db.String(255), nullable=True)

@app.before_first_request
def create_tables():
    db.create_all()
    if not User.query.filter_by(username='admin').first():
        admin = User(username='admin')
        admin.set_password('password')
        db.session.add(admin)
        db.session.commit()

@app.route('/')
def index():
    services = Service.query.all()
    return render_template('index.html', services=services)

@app.route('/mobil')
def mobil():
    return render_template('mobil.html')

@app.route('/video')
def video():
    return render_template('video.html')

@app.route('/admin/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user = User.query.filter_by(username=request.form['username']).first()
        if user and user.check_password(request.form['password']):
            session['user_id'] = user.id
            return redirect(url_for('admin_dashboard'))
        else:
            return render_template('admin/login.html', error='Geçersiz bilgiler')
    return render_template('admin/login.html')

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/admin/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

@app.route('/admin')
@login_required
def admin_dashboard():
    services = Service.query.all()
    return render_template('admin/dashboard.html', services=services)

@app.route('/admin/service/new', methods=['GET', 'POST'])
@login_required
def new_service():
    if request.method == 'POST':
        service = Service(
            title=request.form['title'],
            description=request.form['description'],
            link=request.form['link']
        )
        db.session.add(service)
        db.session.commit()
        return redirect(url_for('admin_dashboard'))
    return render_template('admin/service_form.html', service=None)

@app.route('/admin/service/<int:service_id>/edit', methods=['GET', 'POST'])
@login_required
def edit_service(service_id):
    service = Service.query.get_or_404(service_id)
    if request.method == 'POST':
        service.title = request.form['title']
        service.description = request.form['description']
        service.link = request.form['link']
        db.session.commit()
        return redirect(url_for('admin_dashboard'))
    return render_template('admin/service_form.html', service=service)

@app.route('/admin/service/<int:service_id>/delete')
@login_required
def delete_service(service_id):
    service = Service.query.get_or_404(service_id)
    db.session.delete(service)
    db.session.commit()
    return redirect(url_for('admin_dashboard'))

if __name__ == '__main__':
    app.run(debug=True)
