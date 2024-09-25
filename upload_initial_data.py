from main import app
from application.sec import datastore 
from application.models import db,Role
from flask_security import hash_password
from werkzeug.security import generate_password_hash


with app.app_context():
    db.create_all() #this will create all tables in the database
    datastore.find_or_create_role(name="admin",description="User is an Admin")
    datastore.find_or_create_role(name="influencer",description="User is an Influencer")
    datastore.find_or_create_role(name="sponsor",description="User is a Sponsor")
    db.session.commit()
    if not datastore.find_user(email="admin@email.com"):
        datastore.create_user(email="admin@email.com",password=generate_password_hash("admin"),roles=["admin"])
    if not datastore.find_user(email="sponsor1@email.com"):
        datastore.create_user(username="Nothing",industry="Tech",email="sponsor1@email.com",password=generate_password_hash("sponsor1"),roles=["sponsor"])
    if not datastore.find_user(email="sponsor2@email.com"):
        datastore.create_user(username="Samsung",industry="Tech",email="sponsor2@email.com",password=generate_password_hash("sponsor2"),roles=["sponsor"])
    if not datastore.find_user(email="influencer1@email.com"):
        datastore.create_user(username="Tech Burner",email="influencer1@email.com",
                              password=generate_password_hash("influencer1"),
                              roles=["influencer"],industry="Tech",niche="Unboxing",
                              reach="10 Million",platform="Youtube")
    if not datastore.find_user(email="influencer2@email.com"):
        datastore.create_user(username="SlayyPoint",email="influencer2@email.com",
                              password=generate_password_hash("influencer2"),
                              roles=["influencer"],industry="Travel",niche="Vlogs",
                              reach="8 Million",platform="Youtube")    
    if not datastore.find_user(email="influencer3@email.com"):
        datastore.create_user(username="Technical Guruji",email="influencer3@email.com",
                              password=generate_password_hash("influencer3"),
                              roles=["influencer"],industry="Tech",niche="Lifestyle",
                              reach="25 Million",platform="Youtube")      
    
    db.session.commit()




  
