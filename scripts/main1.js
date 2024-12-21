// calculate BMI.

// The same groups apply to both men and women.
// Underweight: BMI is less than 18.5
// Normal weight: BMI is 18.5 to 24.9
// Overweight: BMI is 25 to 29.9
// Obese: BMI is 30 or more
function calculateBmi(weight, height) {
    const bmi = Math.round((weight /(height/100 * height/100)),1);
    let message = '';
    switch(true) {
        case bmi < 18.5:{
            message = "you are under weight"
            break;
        }
        case (bmi > 18.5 && bmi < 24.9):{
            message = ("your weight is normal");
            break;
        } 
        case (bmi >= 25 && bmi < 29.9):{
            message = ("you are Overweight");
            break;
        } 
        case (bmi >= 25 && bmi < 29.9): {
            message = ("you are fucking fat and your life is fucking risk");
            break;
        }
    }
    alert(`${message}. Your BMI Is ${bmi}`)
}

function getYourBmi() {
    const height = prompt("Enter your height in centimeters");
    const weight = prompt("Enter your weight in kgs");
    calculateBmi(weight,height)
}
getYourBmi()