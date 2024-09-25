from celery import Celery, Task


# Passing the flask app to this function 
def celery_init_app(app):
    # flask task runs the task in the application context. 
    # using this constext to access the application level data and the configurations etc
    class FlaskTask(Task):
        def __call__(self, *args: object, **kwargs: object) -> object:
            with app.app_context():
                return self.run(*args, **kwargs)

    # celery app in the celery instance 
    celery_app = Celery(app.name, task_cls=FlaskTask)
    celery_app.config_from_object("celeryconfig")
    return celery_app