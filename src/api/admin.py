  
import os
from flask_admin import Admin
from .models import db, User, Taco, Protein, Sauce
from flask_admin.contrib.sqla import ModelView


class TacoAdminView(ModelView):
    # Display these columns in the list view
    column_list = ['id', 'tortilla', 'protein', 'sauces']

    # Make these columns searchable
    column_searchable_list = ['id']

    # Add filters for easier navigation
    column_filters = ['tortilla', 'protein.name']

    # Customize how relationships are displayed
    column_display_pk = True  # Show primary key

    # For the form view, specify which fields to include
    form_columns = ['tortilla', 'protein', 'sauces']

    # Format how the protein relationship is displayed
    def _protein_formatter(view, context, model, name):
        if model.protein:
            return f"{model.protein.name} (${model.protein.price})"
        return ""

    # Format how sauces are displayed
    def _sauces_formatter(view, context, model, name):
        if model.sauces:
            return ", ".join([sauce.name for sauce in model.sauces])
        return "No sauces"

    column_formatters = {
        'protein': _protein_formatter,
        'sauces': _sauces_formatter
    }

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(User, db.session))

    admin.add_view(TacoAdminView(Taco, db.session))

    admin.add_view(ModelView(Protein, db.session))
    admin.add_view(ModelView(Sauce, db.session))

    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))