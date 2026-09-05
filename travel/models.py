from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    license = models.CharField(max_length=30, blank=True, null=True)
    car = models.OneToOneField('Car', blank=True, null=True, on_delete=models.SET_NULL)
    description = models.TextField(max_length=200, blank=True, null=True)

    def has_license(self):
        return self.license is not None and self.license != ''
    
    def has_car(self):
        return self.car is not None and self.car.plate_number != '' and self.car.brand != '' and self.car.model != ''

    def to_json(self):
        return {
            'username': self.user.username,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'license': self.license,
            'car': {
                'plate_number': self.car.plate_number if self.car else None,
                'brand': self.car.brand if self.car else None,
                'model': self.car.model if self.car else None,
            },
            'description': self.description
        }


class Car(models.Model):
    plate_number = models.CharField(default='', max_length=40)
    brand = models.CharField(default='', max_length=30)
    model = models.CharField(default='', max_length=30)


class City(models.Model):
    city_name = models.CharField(blank=False, null=False, max_length=40)

class JourneyDetails(models.Model):
    date = models.DateTimeField(blank=False, null=False)
    driver = models.ForeignKey(UserProfile, blank=False, null=False, on_delete=models.CASCADE, related_name='driven_journeys')
    origin = models.ForeignKey(City, blank=False, null=False, on_delete=models.CASCADE, related_name='origin_journeys')
    destination = models.ForeignKey(City, blank=False, null=False, on_delete=models.CASCADE, related_name='destination_journeys')
    seat_price = models.PositiveIntegerField(null=False, validators=[MinValueValidator(1), MaxValueValidator(999)])
    available_seats = models.PositiveSmallIntegerField(null=False, validators=[MinValueValidator(1), MaxValueValidator(7)])
    passengers = models.ManyToManyField(UserProfile, related_name='journeys_as_passenger')
    isActive = models.BooleanField(blank=False, null=False, default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['date', 'driver'], name='unique_journey_for_driver_and_date')
        ]
        
    def clean(self):
        if self.origin == self.destination:
            raise ValidationError("Origin and destination city can not be the same.")

    def journey_details(self):
        return {
            'id': self.id,
            'date': self.date.isoformat(),
            'driver': self.driver.user.username,
            'origin': self.origin.city_name,
            'destination': self.destination.city_name,
            'seat_price': self.seat_price,
            'available_seats': self.available_seats,
            'passengers': [passenger.user.id for passenger in self.passengers.all()],
            'isActive': self.isActive
        }
