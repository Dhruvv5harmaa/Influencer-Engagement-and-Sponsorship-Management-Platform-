from flask_restful import Resource,Api,reqparse,marshal, fields
from .models import Role, StudyResource, User,db,Campaign
from sqlalchemy import or_
from flask import jsonify
from flask_security import auth_required,roles_required,current_user
from datetime import datetime

api=Api(prefix='/api') #all api will start with the prefix /api
parser = reqparse.RequestParser()
parser.add_argument('topic',type=str,help='Topic is required and should be a string',required=True)
parser.add_argument('description',type=str,help='Description is required and should be a string',required=True)
parser.add_argument('resource_link',type=str,help='Resource Link is required and should be a string',required=True)

# Overrriding a Class to create a custom field
class Creator(fields.Raw):
    def format(self,user):
        return user.email


study_material_fields={
    'id':fields.Integer,
    'topic':fields.String,
    'description':fields.String,
    'resource_link':fields.String,
    'is_approved':fields.Boolean,
    'creator':Creator
}

class StudyMaterial(Resource):
    # @marshal_with(study_material_fields)
    @auth_required("token")
    def get(self):
        # all_study_material=StudyResource.query.all() #This will gove all the study resource objects 
        # study_resources=None
        if "inst" in current_user.roles:  
            #If user is  a instructor then 
            #show all Study Resources
             study_resources=StudyResource.query.all()
           
        else:
             study_resources=StudyResource.query.filter(
                or_(StudyResource.is_approved==True,StudyResource.creator==current_user)).all()

        if len(study_resources)>0:
            return marshal(study_resources,study_material_fields)   
        else:
            return {"message":"No Resource Found"},404 
        # return all_study_material

        # if len(all_study_material)>0:
        #     return{"message":"No resource found"},404
        # return all_study_material
    
    @auth_required("token")
    @roles_required("stud")
    def post(self):
        args=parser.parse_args()
        # study_resource=StudyResource(**args) #unpack the args
        study_resource=StudyResource(topic=args.get("topic"),description=args.get("description")
                                     ,resource_link=args.get("resource_link"),creator_id=current_user.id)
        db.session.add(study_resource)
        db.session.commit()
        return {"message":"Study Resource Created"}

  


# ##############################################################
campaign_parser = reqparse.RequestParser()
campaign_parser.add_argument('name', type=str, help='Name is required and should be a string', required=True)
campaign_parser.add_argument('description', type=str, help='Description is required and should be a string', required=True)
campaign_parser.add_argument('start_date', type=str, help='Start Date is required and should be a string', required=True)
campaign_parser.add_argument('end_date', type=str, help='End Date is required and should be a string', required=True)
campaign_parser.add_argument('budget', type=float, help='Budget is required and should be a float', required=True)
campaign_parser.add_argument('visibility', type=str, help='Visibility is required and should be a string', required=True)
campaign_parser.add_argument('goals', type=str, help='Goals should be a string', required=False)
campaign_parser.add_argument('niche', type=str, help='Niche is required and should be a string', required=True)


campaign_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
    'start_date': fields.String,
    'end_date': fields.String,
    'budget': fields.Float,
    'visibility': fields.String,
    'goals': fields.String,
    'niche': fields.String
}
class CampaignResource(Resource):
    @auth_required("token")
    # @marshal_with(campaign_fields)
    def get(self):
        campaigns = Campaign.query.all()
        return campaigns

    @auth_required("token")
    @roles_required("sponsor")
    def post(self):
        args = campaign_parser.parse_args()
        start_date = datetime.strptime(args['start_date'], '%Y-%m-%d').date()
        end_date = datetime.strptime(args['end_date'], '%Y-%m-%d').date()
        campaign = Campaign(
            name=args['name'],
            description=args['description'],
            start_date=start_date,
            end_date=end_date,
            budget=args['budget'],
            visibility=args['visibility'],
            goals=args.get('goals'),
            niche=args['niche'],
            creator_id=current_user.id  # Assuming you have a creator_id field in Campaign
        )
        db.session.add(campaign)
        db.session.commit()
        return {"message": "Campaign created successfully"}


# #########################################################


api.add_resource(CampaignResource, '/campaigns')
api.add_resource(StudyMaterial,'/study_material')  

