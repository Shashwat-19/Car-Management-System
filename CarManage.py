import datetime

print("Welcome to SmartCar-Care")
print("------------------------\nCARS DETAILS\n*************")

user_name = input("Enter your name: ").strip()
print(f"Hello, {user_name}!")

car_details = set()
service_details = set()

def get_current_date():
    """Returns current date as a formatted string."""
    return datetime.datetime.now().strftime("%Y-%m-%d")

def register_car():
    """Registers a car with details"""
    try:
        date = get_current_date()
        car_number = input("Enter your car number: ").strip()
        model_number = input("Enter Model Number: ").strip()
        
        car_data = (user_name, date, car_number, model_number)

        if car_data in car_details:
            print("Car is already registered.")
        else:
            car_details.add(car_data)
            print("Car registered successfully!\n")
    except Exception as e:
        print(f"Error: {e}")

def check_details():
    """Checks and displays car details"""
    car_number = input("Enter your car number: ").strip()
    car = next((c for c in car_details if c[2] == car_number), None)

    if car:
        print(f"\n--- Car Details ---\nOwner: {car[0]}\nRegistered Date: {car[1]}\nCar Number: {car[2]}\nModel Number: {car[3]}\n")
    else:
        print("Invalid car number! Please register first.\n")

def services():
    """Provides car service options"""
    options = {1: "Car Wash", 2: "Car Paint", 3: "Oil Change"}
    
    while True:
        print("\n--- Available Services ---")
        for key, service in options.items():
            print(f"{key}. {service}")
        print("4. Exit")

        try:
            choice = int(input("Choose a service: "))

            if choice == 4:
                print("Exiting services...\n")
                break
            elif choice not in options:
                print("Invalid choice! Try again.")
                continue

            car_number = input("Enter your car number: ").strip()
            model_number = input("Enter Model Number: ").strip()

            if not any(c[2] == car_number for c in car_details):
                print("Car not registered! Please register first.\n")
                continue

            service_data = (options[choice], get_current_date(), car_number, model_number)

            if service_data in service_details:
                print(f"{options[choice]} is already registered for this car.\n")
            else:
                service_details.add(service_data)
                print(f"Successfully registered for {options[choice]}!\n")

        except ValueError:
            print("Invalid input! Please enter a number.")

def display_service_history():
    """Displays service history of a car"""
    car_number = input("Enter your car number to view service history: ").strip()
    history = [s for s in service_details if s[2] == car_number]

    if history:
        print("\n--- Service History ---")
        for s in history:
            print(f"Service: {s[0]}, Date: {s[1]}, Model: {s[3]}")
    else:
        print("No service history found for this car.")

while True:
    print("\n--- Main Menu ---")
    print("1. Register your car")
    print("2. Check details")
    print("3. Services")
    print("4. View Service History")
    print("5. Exit")

    try:
        choice = int(input("Choose an option: "))

        if choice == 1:
            register_car()
        elif choice == 2:
            check_details()
        elif choice == 3:
            services()
        elif choice == 4:
            display_service_history()
        elif choice == 5:
            print("Exiting... Goodbye!\n")
            break
        else:
            print("Invalid choice! Please select a valid option.\n")

    except ValueError:
        print("Invalid input! Please enter a number.")

    if input("Do you want to continue? (yes/no): ").strip().lower() != 'yes':
        break
