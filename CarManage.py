print("Welcome user = 1956")
print("-------------------\nCARS DETAILS\n*************")
user_name = input("Enter your name: ")
print(f"Hello, {user_name}")

car_details = set()
service_details = set()

def register_car():
    car_data = (user_name, float(input("Date: ")), int(input("Enter your car number: ")), int(input("Model Number: ")))
    
    if car_data in car_details:
        print("Car is already registered.")
    else:
        car_details.add(car_data)
        print("Car registered. Thank you!")

def check_details():
    num = int(input("Enter your car number: "))
    car = next((c for c in car_details if c[2] == num), None)
  
    if car:
        print(f"Hello {car[0]},\nRegistered date: {car[1]}\nCar number: {car[2]}\nModel Number: {car[3]}")
    else:
        print("Invalid car number!")

def services():
    options = {1: "Car Wash", 2: "Car Paint"}
    
    while True:
        choice = int(input("1. Car wash\n2. Car paint\n3. Servicing\n4. Exit\nChoose an option: "))
        
        if choice == 4:
            print("Exiting services")
            break
        if choice not in options:
            print("Invalid choice!")
            continue
        if choice == 3:
            print("Sorry, we are out of service!")
            continue
        
        service_data = (options[choice], float(input("Date: ")), int(input("Enter your car number: ")), int(input("Model Number: ")))
        
        if service_data in service_details:
            print(f"{options[choice]} already registered.")
        else:
            service_details.add(service_data)
            print(f"Thank you for registering for {options[choice]}!")

while True:
    choice = int(input("1. Register your car\n2. Check details\n3. Services\n4. Exit\nChoose one option: "))
    
    if choice == 1:
        register_car()
    elif choice == 2:
        check_details()
    elif choice == 3:
        services()
    elif choice == 4:
        print("Exiting..")
        break
    else:
        print("Invalid choice!")
    
    if input("Do you want to continue? (yes/no): ").lower() != 'yes':
        break

print("Goodbye!")
## dummy commit