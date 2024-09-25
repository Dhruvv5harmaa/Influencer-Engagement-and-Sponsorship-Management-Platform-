from flask_sqlalchemy import SQLAlchemy 
from flask_security import UserMixin,RoleMixin
db=SQLAlchemy() #db is SQL Alchemy instance



# this table is for establishing the relationship between User and Roles 
class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))

class User(db.Model,UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=False)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    industry=db.Column(db.String, unique=False)
    niche=db.Column(db.String, unique=False)
    reach=db.Column(db.String, unique=False)
    platform=db.Column(db.String, unique=False)
    roles = db.relationship('Role', secondary='roles_users',
                         backref=db.backref('users', lazy='dynamic'))
    study_resource=db.Relationship('StudyResource',backref='creator')
    # backref is like if we had objec of StudyResource we can access the property 'creator'
    # to get the ussr object . This actually creates a property in StudyResource



class Role(db.Model,RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

class StudyResource(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    topic = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    resource_link = db.Column(db.String, nullable=False)
    is_approved = db.Column(db.Boolean(), default=False)




class AdRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    campaign_id = db.Column(db.Integer, db.ForeignKey('campaign.id'), nullable=False)
    # influencer Id from user table.
    influencer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    messages = db.Column(db.Text, nullable=True)
    requirements = db.Column(db.Text, nullable=True)
    payment_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='Pending')
    delivery = db.Column(db.String(20), nullable=False, default='Pending')
    payment_status = db.Column(db.String(20), nullable=False, default='Pending')
    updated_or_sent_by_influencer = db.Column(db.Boolean, nullable=False, default=False)

class Campaign(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    budget = db.Column(db.Float, nullable=False)
    visibility = db.Column(db.String(10), nullable=False, default='public')
    goals = db.Column(db.Text, nullable=True)
    niche = db.Column(db.Text, nullable=False)
    # Add cascade delete to the ad_requests relationship
    ad_requests = db.relationship('AdRequest', backref='campaign', lazy=True, cascade="all, delete-orphan")


