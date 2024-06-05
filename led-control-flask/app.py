from flask import Flask, request, jsonify
import RPi.GPIO as GPIO

app = Flask(__name__)

# GPIO setup
LED_PIN = 17  # Update with your actual GPIO pin
GPIO.setmode(GPIO.BCM)
GPIO.setup(LED_PIN, GPIO.OUT)

# Control LED
@app.route('/led/on', methods=['POST'])
def led_on():
    GPIO.output(LED_PIN, GPIO.HIGH)
    return jsonify({"status": "LED turned on"})

@app.route('/led/off', methods=['POST'])
def led_off():
    GPIO.output(LED_PIN, GPIO.LOW)
    return jsonify({"status": "LED turned off"})

# Read IO status
@app.route('/io/status', methods=['GET'])
def io_status():
    status = GPIO.input(LED_PIN)
    return jsonify({"status": "ON" if status == GPIO.HIGH else "OFF"})

# Cleanup GPIO on exit
@app.teardown_appcontext
def cleanup(exception=None):
    GPIO.cleanup()

if __name__ == '__main__':
    app.run(port=5000, host='0.0.0.0')
