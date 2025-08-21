#!/usr/bin/env python3
"""
SmartCar-Care Management System
A comprehensive car service management application with enhanced features.
"""

import datetime
import json
import os
from dataclasses import dataclass, asdict
from typing import List, Optional, Dict, Any
from enum import Enum

# Configuration
DATA_DIR = "data"
CARS_FILE = os.path.join(DATA_DIR, "cars.json")
SERVICES_FILE = os.path.join(DATA_DIR, "services.json")


class ServiceType(Enum):
    """Available service types with pricing"""
    CAR_WASH = ("Car Wash", 25.00)
    CAR_PAINT = ("Car Paint", 150.00)
    OIL_CHANGE = ("Oil Change", 45.00)
    TIRE_ROTATION = ("Tire Rotation", 30.00)
    BRAKE_INSPECTION = ("Brake Inspection", 60.00)
    ENGINE_TUNE_UP = ("Engine Tune-Up", 120.00)

    def __init__(self, service_name: str, price: float):
        self.service_name = service_name
        self.price = price


@dataclass
class Car:
    """Car data structure"""
    owner_name: str
    registration_date: str
    car_number: str
    model_number: str
    make: str = ""
    year: int = 0
    color: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Car':
        return cls(**data)


@dataclass
class ServiceRecord:
    """Service record data structure"""
    service_type: str
    service_date: str
    car_number: str
    model_number: str
    price: float
    status: str = "Completed"
    notes: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'ServiceRecord':
        return cls(**data)


class SmartCarCare:
    """Main application class for SmartCar-Care system"""

    def __init__(self):
        self.cars: List[Car] = []
        self.services: List[ServiceRecord] = []
        self.current_user = ""
        self._ensure_data_directory()
        self._load_data()

    def _ensure_data_directory(self):
        """Create data directory if it doesn't exist"""
        if not os.path.exists(DATA_DIR):
            os.makedirs(DATA_DIR)

    def _get_current_date(self) -> str:
        """Returns current date as formatted string"""
        return datetime.datetime.now().strftime("%Y-%m-%d")

    def _save_data(self):
        """Save data to JSON files"""
        try:
            # Save cars
            with open(CARS_FILE, 'w') as f:
                json.dump([car.to_dict() for car in self.cars], f, indent=2)

            # Save services
            with open(SERVICES_FILE, 'w') as f:
                json.dump([service.to_dict() for service in self.services], f, indent=2)

        except Exception as e:
            print(f"Error saving data: {e}")

    def _load_data(self):
        """Load data from JSON files"""
        try:
            # Load cars
            if os.path.exists(CARS_FILE):
                with open(CARS_FILE, 'r') as f:
                    cars_data = json.load(f)
                    self.cars = [Car.from_dict(car) for car in cars_data]

            # Load services
            if os.path.exists(SERVICES_FILE):
                with open(SERVICES_FILE, 'r') as f:
                    services_data = json.load(f)
                    self.services = [ServiceRecord.from_dict(service) for service in services_data]

        except Exception as e:
            print(f"Error loading data: {e}")

    def _find_car_by_number(self, car_number: str) -> Optional[Car]:
        """Find car by car number"""
        return next((car for car in self.cars if car.car_number.lower() == car_number.lower()), None)

    def _validate_car_number(self, car_number: str) -> bool:
        """Basic validation for car number format"""
        return len(car_number) >= 3 and car_number.replace('-', '').replace(' ', '').isalnum()

    def welcome_user(self):
        """Welcome screen and user setup"""
        print(" Welcome to SmartCar-Care")
        print("=" * 50)
        print("Your Complete Car Service Management System")
        print("=" * 50)

        self.current_user = input("👤 Enter your name: ").strip()
        if not self.current_user:
            self.current_user = "Guest"

        print(f"\n Hello, {self.current_user}! Let's take care of your car.")

    def register_car(self):
        """Enhanced car registration with additional details"""
        print("\n CAR REGISTRATION")
        print("-" * 30)

        try:
            car_number = input("🔢 Enter car number (e.g., ABC-1234): ").strip().upper()

            if not self._validate_car_number(car_number):
                print(" Invalid car number format!")
                return

            if self._find_car_by_number(car_number):
                print("⚠  Car is already registered!")
                return

            # Collect additional details
            model_number = input("  Enter model: ").strip()
            make = input(" Enter make (e.g., Toyota, Honda): ").strip()

            year_str = input(" Enter year (optional): ").strip()
            year = int(year_str) if year_str.isdigit() and len(year_str) == 4 else 0

            color = input(" Enter color (optional): ").strip()

            # Create and add new car
            new_car = Car(
                owner_name=self.current_user,
                registration_date=self._get_current_date(),
                car_number=car_number,
                model_number=model_number,
                make=make,
                year=year,
                color=color
            )

            self.cars.append(new_car)
            self._save_data()

            print(" Car registered successfully!")
            print(f" Registration Details:")
            print(f"   • Car Number: {car_number}")
            print(f"   • Model: {model_number}")
            print(f"   • Make: {make}")
            if year > 0:
                print(f"   • Year: {year}")
            if color:
                print(f"   • Color: {color}")

        except ValueError:
            print(" Invalid input! Please check your entries.")
        except Exception as e:
            print(f" Error: {e}")

    def check_car_details(self):
        """Enhanced car details display"""
        print("\n CAR DETAILS LOOKUP")
        print("-" * 30)

        car_number = input("🔢 Enter car number: ").strip().upper()
        car = self._find_car_by_number(car_number)

        if car:
            print(f"\n Car Information")
            print("=" * 40)
            print(f" Owner: {car.owner_name}")
            print(f" Registered: {car.registration_date}")
            print(f" Car Number: {car.car_number}")
            print(f"  Model: {car.model_number}")
            if car.make:
                print(f" Make: {car.make}")
            if car.year > 0:
                print(f" Year: {car.year}")
            if car.color:
                print(f" Color: {car.color}")

            # Show service summary
            car_services = [s for s in self.services if s.car_number == car_number]
            print(f"🔧 Total Services: {len(car_services)}")

            if car_services:
                total_spent = sum(s.price for s in car_services)
                print(f" Total Spent: ${total_spent:.2f}")
        else:
            print(" Car not found! Please check the car number or register first.")

    def book_service(self):
        """Enhanced service booking with pricing"""
        print("\n🔧 SERVICE BOOKING")
        print("-" * 30)

        car_number = input("🔢 Enter car number: ").strip().upper()
        car = self._find_car_by_number(car_number)

        if not car:
            print(" Car not registered! Please register your car first.")
            return

        # Display available services
        print("\n🛠️  Available Services:")
        print("-" * 25)
        services_list = list(ServiceType)

        for i, service in enumerate(services_list, 1):
            print(f"{i}. {service.service_name} - ${service.price:.2f}")

        try:
            choice = int(input("\n Choose service (number): ")) - 1

            if 0 <= choice < len(services_list):
                selected_service = services_list[choice]

                # Check for duplicate recent services (within 30 days)
                recent_services = [
                    s for s in self.services
                    if s.car_number == car_number
                       and s.service_type == selected_service.service_name
                       and (datetime.datetime.now() - datetime.datetime.strptime(s.service_date, "%Y-%m-%d")).days < 30
                ]

                if recent_services:
                    print(f"  You already have {selected_service.service_name} scheduled recently!")
                    if input("Continue anyway? (y/n): ").lower() != 'y':
                        return

                # Additional notes
                notes = input(" Any special notes (optional): ").strip()

                # Create service record
                new_service = ServiceRecord(
                    service_type=selected_service.service_name,
                    service_date=self._get_current_date(),
                    car_number=car_number,
                    model_number=car.model_number,
                    price=selected_service.price,
                    notes=notes
                )

                self.services.append(new_service)
                self._save_data()

                print(" Service booked successfully!")
                print(f" Booking Details:")
                print(f"   • Service: {selected_service.service_name}")
                print(f"   • Price: ${selected_service.price:.2f}")
                print(f"   • Date: {self._get_current_date()}")
                if notes:
                    print(f"   • Notes: {notes}")
            else:
                print(" Invalid service selection!")

        except ValueError:
            print(" Please enter a valid number!")

    def view_service_history(self):
        """Enhanced service history with filtering and stats"""
        print("\n SERVICE HISTORY")
        print("-" * 30)

        car_number = input("🔢 Enter car number: ").strip().upper()
        car_services = [s for s in self.services if s.car_number == car_number]

        if not car_services:
            print(" No service history found for this car.")
            return

        # Sort by date (most recent first)
        car_services.sort(key=lambda x: x.service_date, reverse=True)

        print(f"\n📋 Service History for {car_number}")
        print("=" * 50)

        total_cost = 0
        for i, service in enumerate(car_services, 1):
            print(f"\n{i}. {service.service_type}")
            print(f"    Date: {service.service_date}")
            print(f"    Cost: ${service.price:.2f}")
            print(f"    Status: {service.status}")
            if service.notes:
                print(f"   Notes: {service.notes}")
            total_cost += service.price

        print(f"\n Total Spent: ${total_cost:.2f}")
        print(f" Total Services: {len(car_services)}")

    def show_statistics(self):
        """Display system statistics"""
        print("\n SYSTEM STATISTICS")
        print("-" * 30)

        print(f" Total Cars Registered: {len(self.cars)}")
        print(f" Total Services Completed: {len(self.services)}")

        if self.services:
            total_revenue = sum(s.price for s in self.services)
            print(f" Total Revenue: ${total_revenue:.2f}")

            # Most popular service
            service_counts = {}
            for service in self.services:
                service_counts[service.service_type] = service_counts.get(service.service_type, 0) + 1

            if service_counts:
                most_popular = max(service_counts.items(), key=lambda x: x[1])
                print(f" Most Popular Service: {most_popular[0]} ({most_popular[1]} times)")

        # Recent activity
        recent_services = [
            s for s in self.services
            if (datetime.datetime.now() - datetime.datetime.strptime(s.service_date, "%Y-%m-%d")).days <= 7
        ]
        print(f" Services This Week: {len(recent_services)}")

    def main_menu(self):
        """Enhanced main menu with better UX"""
        while True:
            print(f"\n MAIN MENU - Welcome back, {self.current_user}!")
            print("=" * 50)
            print("1.  Register New Car")
            print("2.  Check Car Details")
            print("3.  Book Service")
            print("4.  View Service History")
            print("5.  Show Statistics")
            print("6.  Exit")
            print("-" * 50)

            try:
                choice = int(input(" Choose option (1-6): "))

                if choice == 1:
                    self.register_car()
                elif choice == 2:
                    self.check_car_details()
                elif choice == 3:
                    self.book_service()
                elif choice == 4:
                    self.view_service_history()
                elif choice == 5:
                    self.show_statistics()
                elif choice == 6:
                    print(" Thank you for using SmartCar-Care!")
                    print(" Drive safe and see you next time!")
                    break
                else:
                    print(" Invalid choice! Please select 1-6.")

            except ValueError:
                print(" Please enter a valid number!")
            except KeyboardInterrupt:
                print("\n\n Goodbye!")
                break

            # Continue prompt
            input("\n⏸️  Press Enter to continue...")


def main():
    """Main application entry point"""
    try:
        app = SmartCarCare()
        app.welcome_user()
        app.main_menu()
    except KeyboardInterrupt:
        print("\n\n Application terminated by user.")
    except Exception as e:
        print(f" Unexpected error: {e}")


if __name__ == "__main__":
    main()