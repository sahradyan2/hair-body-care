const inputRange = document.querySelector("#inputRange");

const rubBlock = document.querySelector("#rubBlock");

rubBlock.innerHTML = inputRange.value;


inputRange.oninput=function () {
    rubBlock.innerHTML =  this.value *1.25 + " $"
    
}

