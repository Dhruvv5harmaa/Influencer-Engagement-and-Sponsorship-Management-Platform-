
from celery import shared_task
from .models import User
import flask_excel as excel # type: ignore
from .mail_service import send_message
from .models import User, Role
from jinja2 import Template



# Our task is not going to ignore the result,
@shared_task(ignore_result=False)
def create_resource_csv():
    all_user = User.query.with_entities(
        User.username, User.email).all()

    csv_output = excel.make_response_from_query_sets(
        all_user, ["username", "email"], "csv")
    filename = "test.csv"

    with open(filename, 'wb') as f:
        f.write(csv_output.data)

    return filename


# @shared_task(ignore_result=False)
# def daily_reminder(message):
#     return message

@shared_task(ignore_result=True)
def daily_reminder(to, subject):
    # users = User.query.filter(User.roles.any(Role.name == '')).all()
    users = User.query.filter(User.roles.any(Role.name.in_(["influencer", "sponsor"]))).all()

    for user in users:
        # with open('test.html', 'r') as f:
        #     template = Template(f.read())
        #     send_message(user.email, subject,
        #                  template.render(email=user.email))
        send_message(user.email,subject,"Hey there please visit our platform")    

   
    return "OK"
