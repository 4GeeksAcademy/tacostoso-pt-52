from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Enum, ForeignKey, Float, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from typing import List
from enum import Enum as pyenum

db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }


class Tortilla(pyenum):
    HARINA = 1
    MAIZ = 2


class Protein(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(16), nullable=False)
    price: Mapped[float] = mapped_column(Float(2), nullable=False)
    # tacos

    def __init__(self, name, price):
        self.name = name
        self.price = float(price)

    def save(self):
        try:
            db.session.add(self)
            db.session.commit()
        except:
            return Exception("Something happened storing the protein in the db.")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": self.price
        }


class Spice(pyenum):
    BAJO = 0
    POCO = 1
    MEDIO = 2
    ALTO = 3
    AGRESIVO = 4
    ARRANCA_GARGANTAS = 5


# Modelado
assosiation_sauces = db.Table('assosiation_sauces', db.metadata,
                              db.Column('taco_id', Integer,
                                        ForeignKey('taco.id')),
                              db.Column('sauce_id', Integer,
                                        ForeignKey('sauce.id'))
                              )


class Sauce(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(16), nullable=False)
    spice: Mapped[Enum] = mapped_column(Enum(Spice), nullable=False)

    tacos: Mapped[List["Taco"]] = relationship(
        secondary=assosiation_sauces, back_populates="sauces"
    )

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "spice": self.spice.name
        }

class Taco(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)

    tortilla: Mapped[Enum] = mapped_column(Enum(Tortilla), nullable=False)

    protein_id: Mapped[int] = mapped_column(
        ForeignKey("protein.id"), nullable=False
    )
    protein: Mapped["Protein"] = relationship(backref="tacos")

    sauces: Mapped[List["Sauce"]] = relationship(
        secondary=assosiation_sauces, back_populates="tacos"
    )

    def __init__(self, tortilla, protein, sauces=[]):

        self.tortilla = Tortilla(tortilla)

        try:
            self.tortilla = Tortilla(tortilla)
        except ValueError:
            raise ValueError("This type of tortilla is not available.")

        self.protein = protein
        self.sauces = sauces

    def save(self):
        try:
            db.session.add(self)
            db.session.commit()
        except:
            Exception("Something wrong happened while storing a Taco on the db.")


    def serialize(self):
        return {
            "id": self.id,
            "tortilla": self.tortilla.name,
            "protein": self.protein.serialize(),
            "sauces": [item.serialize() for item in self.sauces]
        }
