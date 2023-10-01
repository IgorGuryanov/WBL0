const itemDecl = n => {  
    n = Math.abs(n) % 100; 
    let n1 = n % 10;
    if (n > 4 && n < 21) { return 'товаров'; }
    if (n1 > 1 && n1 < 5) { return 'товара'; }
    if (n1 == 1) { return 'товар'; }
    return 'товаров';
}


const items = [
     {
        cost: 150,
        count: 10,
        late: 4,
    },

 {
        cost: 300,
        count: 5,
        late: 2,
    },

     {
        cost: 350,
        count: 15,
        late: 5,
    }
]

const sale = 0.55
const userSale = 0.1
const saleIncrement = 1 + sale + userSale;

const priceFields = document.querySelectorAll('.bucket__item-infoprice .total-price span');
const desktopPriceFields = document.querySelectorAll('.bucket__item-price .total-price span');
const crossedPriceFields = document.querySelectorAll('.bucket__item-infoprice .crossed span');
const desktopCrossedPriceFields = document.querySelectorAll('.bucket__item-price .crossed span');

const controls = document.querySelectorAll('.bucket__item-counter')
const minusButtons = document.querySelectorAll('.bucket__item-counter>button:nth-child(1)')
const plusButtons = document.querySelectorAll('.bucket__item-counter>input+button')
const leftFields = document.querySelectorAll('.bucket__item-remain')

const totalField = document.querySelector('.total__sum-field span')
const totalField2 = document.querySelector('.total__items-field span')
const totalDiscountField = document.querySelector('.total__discount-field span')
const totalItemsField = document.querySelector('.total__items p')
const totalItemsIcons = document.querySelectorAll('.bucket__label')

const deleteButtons = document.querySelectorAll('.bucket__item-icons>button:nth-child(2)');
const bucketItems = document.querySelectorAll('.bucket__item');

const itemCheckboxes = document.querySelectorAll("input[name=check__item]");
const itemAllCheckbox = document.querySelector("input[name=bucket_all]");

const paymentTypeCheckbox = document.querySelector("input[name=check__payment]");
const paymentButton = document.querySelector(".total__paybutton");

const bucketMenuHiddenCountField = document.querySelector('.bucket__menu-hidden .count');
const bucketMenuHiddenAmountField = document.querySelector('.bucket__menu-hidden .amount');

const deliveryItemsFirst = document.querySelectorAll(".delivery__items.first .delivery__item");
const deliveryItemsSecond = document.querySelectorAll(".delivery__items.second .delivery__item");
const deliveryDateSecond = document.querySelector(".delivery__date:nth-child(2)");
const deliveryDateTotal = document.querySelector(".total__delivery-date");


const saleCountFields = document.querySelectorAll(".sale__count");

const updateDeliveryItemBlock = (index) => {
    const isInFirstOrder = countItems[index] < items[index].count - items[index].late;
    const itemField = isInFirstOrder ? deliveryItemsFirst : deliveryItemsSecond;
    let secondOrderCount = countItems[index] - (items[index].count - items[index].late) + 1;
    
    itemField[index].replaceChildren();
    deliveryDateTotal.replaceChildren();

    const labelCount = isInFirstOrder ?
        countItems[index]  : secondOrderCount;
    
    if(labelCount > 0) {
        let wrapper = document.createElement("div");
        wrapper.className = 'image__wrapper';
        wrapper.innerHTML =  `<img src="./assets/bucket-item${index+1}.png" alt="item${index+1}">`;
        let label = document.createElement("div")
        
        const labelCount = isInFirstOrder ?
        countItems[index]  : secondOrderCount;

        label.textContent = labelCount
        label.className = (labelCount> 1) ?
        'delivery__label ' : 'delivery__label hidden';
        wrapper.append(label);
        itemField[index].appendChild(wrapper)
    } 
    if (secondOrderCount < 1) {
        deliveryItemsSecond[index].replaceChildren();
        deliveryDateSecond.classList.add('hidden');
        deliveryDateTotal.textContent = '5-6 фев'
    } else {
        deliveryDateSecond.classList.remove('hidden');
        deliveryDateTotal.textContent = '5-8 фев'
    }
}


let amount = [];
let countItems = [];
let checkItems = items.length;
let deletedItems = 0;


const infoField = document.querySelector(".total__payment-info");
const infoField2 = document.querySelector("p.payment-type__help");


paymentTypeCheckbox.addEventListener('change', function() {
    if(this.checked) {
        infoField.style.display = infoField2.style.display  = 'none';
    } else {
        infoField.style.display = infoField2.style.display  = 'block';
    }
})

const updateTotalPriceFields = (amount) => {
    let totalAmount = amount.reduce((a,b)=>a+b,0);
    totalField.textContent =  bucketMenuHiddenAmountField.textContent = totalAmount;
    totalField2.textContent  = Math.floor(totalAmount*saleIncrement);
    totalDiscountField.textContent = Math.ceil(totalAmount*(saleIncrement-1));
    if(paymentTypeCheckbox.checked) {
        paymentButton.textContent = `Оплатить ${totalAmount} сом`
    } 
}

const updateTotalItemsFields = (countItems) => {
    let totalItemsCount = countItems.reduce((a,b) => Number(a)+Number(b), 0);
    totalItemsField.textContent = bucketMenuHiddenCountField.textContent = 
     `${totalItemsCount} ${itemDecl(totalItemsCount)}`;
 
    for (let icon of totalItemsIcons) {
        if (totalItemsCount > 0) {
            if(icon.classList.contains('hidden')) {
                icon.classList.remove('hidden')
            }
            icon.textContent = totalItemsCount;
            } else {
                icon.classList.add('hidden')
            }
    }
    
}

const updateLocalItemFields = (i, amount) => {
    saleCountFields[i].innerHTML =  
    `<p>– ${Math.floor(amount[i]*sale)} сом</p>
    <p>– ${Math.floor(amount[i]*userSale)} сом</p>`;
    leftFields[i].textContent = '';
    desktopPriceFields[i].textContent = priceFields[i].textContent = amount[i];
    desktopCrossedPriceFields[i].textContent = crossedPriceFields[i].textContent = Math.floor(amount[i]*saleIncrement);
    let left = items[i].count - controls[i].children[1].value
            leftFields[i].textContent = (left != 0 && left <= 5) ?
            `Осталось ${left} шт.` : ' ';
}

for (let i = 0; i < controls.length; i++) {
    amount[i]=controls[i].children[1].value * items[i].cost;
    countItems[i]=controls[i].children[1].value;

    updateDeliveryItemBlock(i);
    updateLocalItemFields(i, amount);

    controls[i].addEventListener('click', (e) => {
        if(e.target === controls[i].children[0]) {
            if(controls[i].children[1].value <= 1) {
                return
            }
            controls[i].children[1].value--;

            if(controls[i].children[1].value == 1) {
                minusButtons[i].classList.add('gray')
            }
            if(items[i].count > controls[i].children[1].value && plusButtons[i].classList.contains('gray')) {
                 plusButtons[i].classList.remove('gray') 
            }

            amount[i] = controls[i].children[1].value * items[i].cost;
            if(itemCheckboxes[i].checked === true) {
                updateTotalPriceFields(amount);
                countItems[i]=controls[i].children[1].value;
                updateDeliveryItemBlock(i);
                updateTotalItemsFields(countItems)
            }
            updateLocalItemFields(i, amount);
        }
        if(e.target === controls[i].children[2]) {
            if(items[i].count <= controls[i].children[1].value) {
                return
            }
            controls[i].children[1].value++;

            if(items[i].count == controls[i].children[1].value) {
                plusButtons[i].classList.add('gray')
            }
            if(controls[i].children[1].value == 2 && minusButtons[i].classList.contains('gray')) {
                minusButtons[i].classList.remove('gray')
            }
            amount[i] = controls[i].children[1].value * items[i].cost;
            if(itemCheckboxes[i].checked === true) {
                updateTotalPriceFields(amount);
                countItems[i]=controls[i].children[1].value;
                updateDeliveryItemBlock(i);
                updateTotalItemsFields(countItems)
            }
            updateLocalItemFields(i, amount);
        }
    })
    
    controls[i].children[1].addEventListener('change', (e) => {

        if(plusButtons[i].classList.contains('gray')) {
            plusButtons[i].classList.remove('gray')
        }

        if(items[i].count <= e.target.value) {
            controls[i].children[1].value = items[i].count;
            plusButtons[i].classList.add('gray')
        }
        if(e.target.value < 1) {
            controls[i].children[1].value = 1
        }
        if(minusButtons[i].classList.contains('gray')) {
            minusButtons[i].classList.remove('gray')
        }
        
        controls[i].children[1].value = e.target.value;
        if(controls[i].children[1].value == 1) {
            minusButtons[i].classList.add('gray')
        } 

        amount[i]=controls[i].children[1].value * items[i].cost;
        if(itemCheckboxes[i].checked === true) {
            updateTotalPriceFields(amount);
            countItems[i]=controls[i].children[1].value;
            updateDeliveryItemBlock(i);
            updateTotalItemsFields(countItems)
        }
        updateLocalItemFields(i, amount);
    })
}

updateTotalPriceFields(amount);
updateTotalItemsFields(countItems);

for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener('click', () => {
        deletedItems++;
        if(itemCheckboxes[i].checked) {
            checkItems--;
        }
        bucketItems[i].remove();
        amount[i]=0;
        countItems[i]=0;
        controls[i].children[1].value = 0;
        
        if(checkItems === bucketItems.length - deletedItems) {
            itemAllCheckbox.checked = true;
        }
        updateDeliveryItemBlock(i);
        updateTotalPriceFields(amount);
        updateTotalItemsFields(countItems)
    })
}

itemAllCheckbox.addEventListener('change', function() {
    if (this.checked) {
        checkItems = bucketItems.length;
        itemCheckboxes.forEach((item) => item.checked = true);
        for (let i = 0; i < itemCheckboxes.length; i++) {
            amount[i] = controls[i].children[1].value * items[i].cost;
            countItems[i]=controls[i].children[1].value;
            updateDeliveryItemBlock(i);
            updateTotalPriceFields(amount);
            updateTotalItemsFields(countItems)
        }
    } else {
        checkItems = 0;
        itemCheckboxes.forEach((item) => item.checked = false);
        for (let i = 0; i < itemCheckboxes.length; i++) {
            amount[i]=0;
            countItems[i]=0;
            updateDeliveryItemBlock(i);
            updateTotalPriceFields(amount);
            updateTotalItemsFields(countItems)
        }
    }
})

for (let i = 0; i < itemCheckboxes.length; i++) {
    itemCheckboxes[i].addEventListener('change', function() {
    if (this.checked) {
        checkItems++;
        if(checkItems === bucketItems.length) {
         itemAllCheckbox.checked = true;
        }
        amount[i] = controls[i].children[1].value * items[i].cost;
        countItems[i]=controls[i].children[1].value;
        updateDeliveryItemBlock(i);
        updateTotalPriceFields(amount);
        updateTotalItemsFields(countItems)
    } else {
        checkItems--;
        itemAllCheckbox.checked = false;
        amount[i]=0;
        countItems[i]=0;
        updateDeliveryItemBlock(i);
        updateTotalPriceFields(amount);
        updateTotalItemsFields(countItems);
    }
    });
}


paymentTypeCheckbox.addEventListener('change', function() {
    if (this.checked) {
        updateTotalPriceFields(amount)
    } else {
        paymentButton.textContent = 'Заказать';
    }
})

const deleteMissingButtons = document.querySelectorAll('.missing__item-icons>button:nth-child(2)');
const missingItems = document.querySelectorAll('.missing__item');
const missingField = document.querySelector('.missing__menu-check p');

let deletedMissingItems = 0;

for (let i = 0; i < deleteMissingButtons.length; i++) {
    deleteMissingButtons[i].addEventListener('click', () => {
        missingItems[i].remove();
        deletedMissingItems++;
        let left = missingItems.length-deletedMissingItems;
        missingField.textContent = `Отсутствуют · ${left} ${itemDecl(left)}`;
    })
}

const bucketMenu = document.querySelector('.bucket__menu-check');
const bucketMenuHidden = document.querySelector('.bucket__menu-hidden');
const bucketHideButton = document.querySelector('.bucket__menu button');
const bucketRow = document.querySelector('.bucket__row');

const missingHideButton = document.querySelector('.missing__menu button');
const missingRow = document.querySelector('.missing__row');


const toggleBucketRow = () => {
    bucketHideButton.classList.toggle('rotated')
    bucketRow.classList.toggle('hidden')
    bucketMenu.classList.toggle('hidden')
    bucketRow.style.overflow='hidden';
    bucketMenuHidden.classList.toggle('hidden')
    if(bucketRow.classList.contains("hidden")) {
        bucketRow.style.maxHeight = 0;
        setTimeout(() => bucketRow.style.overflow='visible', 400)
       }
       else {
        bucketRow.style.maxHeight = bucketRow.scrollHeight + "px";
       }
   
}

bucketHideButton.addEventListener('click', () => toggleBucketRow());

const toggleMissingRow = () => {
    missingHideButton.classList.toggle('rotated')
    missingRow.classList.toggle('hidden')
    if(missingRow.classList.contains("hidden")) {
        missingRow.style.maxHeight = 0;
       }
       else {
        missingRow.style.maxHeight = missingRow.scrollHeight + "px";
       }
   
}

missingHideButton.addEventListener('click', () => toggleMissingRow());

const deliveryModal = document.querySelector('.delivery__modal');
const deliveryChangeButton = document.querySelector('.delivery__change');
const deliveryModalCloseButton = document.querySelector('.delivery__modal .close');

const paymentModal = document.querySelector('.payment__modal');
const paymentChangeButton = document.querySelector('.payment-type__change');
const paymentModalCloseButton = document.querySelector('.payment__modal .close');


const main = document.querySelector('main');
const footer = document.querySelector('footer');

const openModal = (modal) => {
    document.body.style.overflow = "hidden";
    main.classList.add("opened");
    footer.classList.add("opened");
    modal.style.display = 'flex';
}

const closeModal = (modal) => {
    modal.style.display = "none";
    document.body.style.overflow = "";
    main.classList.remove("opened");
    footer.classList.remove("opened");
}

deliveryChangeButton.addEventListener('click', () => openModal(deliveryModal))
deliveryModalCloseButton.addEventListener('click', () => closeModal(deliveryModal))
paymentChangeButton.addEventListener('click', () => openModal(paymentModal))
paymentModalCloseButton.addEventListener('click', () => closeModal(paymentModal))

window.onclick = function(event) {
    if (event.target == deliveryModal) {
        closeModal(deliveryModal)
    }
    if (event.target == paymentModal) {
        closeModal(paymentModal)
    }
  }
  
  const editPaymentTotalButton = document.querySelector('button.edit__payment');
  const editDeliveryTotalButton = document.querySelector('button.edit__delivery');
  editDeliveryTotalButton.addEventListener('click', () => openModal(deliveryModal));
  editPaymentTotalButton.addEventListener('click', () => openModal(paymentModal));

const paymentForm = document.querySelector('.payment__form');
const paymentRadios = document.querySelectorAll('input[name="payment__radio"]')
const paymentTypeField = document.querySelector('.payment-type .payment-type__info img');
const paymentTypeTotalField = document.querySelector('.total__payment-field img');


paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    for (let radio of paymentRadios) {
    if (radio.checked) {
        paymentTypeTotalField.src =  `./assets/${radio.value}.svg`;
        paymentTypeField.src =  `./assets/${radio.value}.svg`;
    }
    }
    closeModal(paymentModal)
    
})

const deliveryPlaceForm = document.querySelector('.form__row.place');
const deliveryPlaceButton = document.querySelector('.delivery__type-row .place');
const deliveryCourierForm = document.querySelector('.form__row.courier');
const deliveryCourierButton = document.querySelector('.delivery__type-row .courier');

const deliveryTypeChangeButtonsField = document.querySelector('.delivery__type-row');


const courierRadiosInputs = document.querySelectorAll('input[name="courier__radio"]')
const placeRadiosInputs = document.querySelectorAll('input[name="place__radio"]')

deliveryTypeChangeButtonsField.addEventListener('click', (e) => {
    e.preventDefault();
    if(e.target === deliveryPlaceButton) {
        deliveryCourierForm.style.display = 'none'
        deliveryPlaceForm.style.display = 'flex';
        deliveryCourierButton.classList.remove('selected')
        deliveryPlaceButton.classList.add('selected')
        for (let radio of courierRadiosInputs) {
            radio.checked = false
        }
        placeRadiosInputs[0].checked = true;

    }
    if(e.target === deliveryCourierButton) {
        deliveryPlaceForm.style.display = 'none'
        deliveryCourierForm.style.display = 'flex';
        deliveryPlaceButton.classList.remove('selected')
        deliveryCourierButton.classList.add('selected')
        for (let radio of placeRadiosInputs) {
            radio.checked = false
        }
        courierRadiosInputs[0].checked = true;
    }
})

const courierRadios = document.querySelectorAll('.delivery__form .form_radio')
const courierRadiosDeleteButtons = document.querySelectorAll('.delivery__place-delete')


for (let i=0; i<courierRadios.length; i++) {
    courierRadiosDeleteButtons[i].addEventListener('click', (e) => {
        e.preventDefault();
         courierRadios[i].remove();
    })
}

const deliveryTitle = document.querySelector('.total__delivery-title');
const deliveryAdress = document.querySelector('.total__delivery-adress');

const deliveryPoint = document.querySelector('.delivery .delivery__point');
const deliveryForm = document.querySelector('.delivery__form');

const updateDeliveryPoint = (name, text) => {
    const textType = (name === "courier__radio") ? 'Курьером' : "Пункт выдачи"
        deliveryPoint.replaceChildren();
        deliveryTitle.replaceChildren();
        deliveryAdress.replaceChildren();
        deliveryTitle.textContent = (name === "courier__radio") ? 
        'Доставка курьером' : "Доставка в пункт выдачи";
        deliveryAdress.textContent = text;
        deliveryPoint.innerHTML =  
        `<div class="delivery__type">
            ${textType}
        </div>
        <div class="delivery__place">
            <div class="delivery__adress">
                ${text}
            </div>
            ${
                (textType === 'Пункт выдачи') ?
                `<div class="delivery__adress-info">
                    <img src="./assets/raitingIcon.svg" alt="raiting">
                        <div class="raiting">
                            4.99
                        </div>
                        <div class="time">
                            Ежедневно с 10 до 21 
                        </div>
                </div>`
                : ''
                
            }
        
        </div>`;

}

deliveryForm.addEventListener('submit', (e) => {
    e.preventDefault();
  
    for (let radio of placeRadiosInputs) {
        if (radio.checked) {
        switch (radio.value) {
            case '1': 
            updateDeliveryPoint(radio.name, 'г. Бишкек, микрорайон Джал, улица Ахунбаева Исы, д. 67/1'); 
            break;
            case '2': 
            updateDeliveryPoint(radio.name,'г. Бишкек, микрорайон Джал, улица Ахунбаева Исы, д. 1');
             break;
            case '3':
             updateDeliveryPoint(radio.name,'г. Бишкек, улица Табышалиева, д. 57');
             break;
           
            default: updateDeliveryPoint(radio.name, '');
        }
       
        }
    }

    for (let radio of courierRadiosInputs) {
        if (radio.checked) {
            
            switch (radio.value) {
                case '4': 
                updateDeliveryPoint(radio.name, 'Бишкек, улица Табышалиева, 57'); 
                break;
                case '5': 
                updateDeliveryPoint(radio.name, 'Бишкек, улица Жукеева-Пудовкина, 77/1');
                break;
                case '6':
                updateDeliveryPoint(radio.name,' Бишкек, микрорайон Джал, улица Ахунбаева Исы, 67/1');
                break;
            
                default: updateDeliveryPoint(radio.name, '');
            }
    }
    }
    closeModal(deliveryModal)
    
})


const userFormInputs = document.querySelectorAll('.input__wrapper input')
const upperPlaceholders = document.querySelectorAll('.upper-placeholder')
const errorPlaceholders = document.querySelectorAll('.error-placeholder')
const formLines = document.querySelectorAll('.input__wrapper .line')

for (let i=0; i < userFormInputs.length; i++) {
    userFormInputs[i].addEventListener('input', () => {
        upperPlaceholders[i].style.display = 
        (userFormInputs[i].value.length > 0) ?
        'block' : 'none'
        
    })
}

function debounce(func, wait) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};


const userFormInputName = document.querySelector(".input__wrapper input[name='Имя']")
const userFormInputNameError = document.querySelector(".error-placeholder.name")


const validateName = () => {
    const isNotEmpty = userFormInputName.value.length > 0;
    if(isNotEmpty) {
        userFormInputNameError.style.display =  'none'
        userFormInputName.classList.remove('errorText')
        formLines[0].classList.remove('errorBlock')
    } else {
        userFormInputNameError.textContent = 'Укажите имя'
        userFormInputName.classList.add('errorText')
        formLines[0].classList.add('errorBlock')
    }
}
const validateNameDebounced = debounce(validateName, 400);
userFormInputName.addEventListener('input', validateNameDebounced)


const userFormInputSurname = document.querySelector(".input__wrapper input[name='Фамилия']")
const userFormInputSurnameError = document.querySelector(".error-placeholder.surname")


const validateSurname = () => {
    const isNotEmpty = userFormInputSurname.value.length > 0;
    if(isNotEmpty) {
        userFormInputSurnameError.style.display =  'none'
        userFormInputSurname.classList.remove('errorText')
        formLines[1].classList.remove('errorBlock')
    } else {
        userFormInputSurnameError.textContent = 'Введите фамилию'
    }
}
const validateSurnameDebounced = debounce(validateSurname, 400);
userFormInputSurname.addEventListener('input', validateSurnameDebounced)


const userFormInputMail = document.querySelector(".input__wrapper input[name='Почта']")
const userFormInputMailError = document.querySelector(".error-placeholder.mail")


const validateEmail = () => {
   const isValid = (
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
   .test(userFormInputMail.value)
   )
   const isNotEmpty = userFormInputMail.value.length > 0;

   if (!isNotEmpty) {
    userFormInputMailError.textContent = 'Укажите электронную почту'
    userFormInputMail.classList.remove('errorText')
    formLines[2].classList.remove('errorBlock')
   }

   if (!isNotEmpty || isValid) {
    userFormInputMail.classList.remove('errorText')
    formLines[2].classList.remove('errorBlock')  
 }
   userFormInputMailError.style.display =
    (!isNotEmpty || isValid)   ? 'none' : 'block';
   
   if (!isValid && isNotEmpty) {
    userFormInputMailError.textContent =
     'Проверьте адрес электронной почты';
     userFormInputMailError.style.display = 'block'
     userFormInputMail.classList.add('errorText')
     formLines[2].classList.add('errorBlock')
   }
}
const validateEmailDebounced = debounce(validateEmail, 400);
userFormInputMail.addEventListener('input', validateEmailDebounced)



const userFormInputPhone = document.querySelector(".input__wrapper input[name='Телефон']")
const userFormInputPhoneError = document.querySelector(".error-placeholder.phone")

var eventCalllback = function(e) {
    let el = e.target,
      pattern = el.dataset.phonePattern
      matrix_def = "+7 ___ ___ __ __"
      matrix = pattern ? pattern : matrix_def
      i = 0
      def = matrix.replace(/\D/g, ""),
      val = e.target.value.replace(/\D/g, "");
    e.target.value = matrix.replace(/./g, function(a) {
      return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? "" : a
    });

  }
 userFormInputPhone.addEventListener('input', eventCalllback);

 const validatePhone = () => {
    const isValid = (
        /^((\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{10}$/
    .test(userFormInputPhone.value.replaceAll(' ', ''))
    )
    const isNotEmpty = userFormInputPhone.value.length > 0;
    if(!isNotEmpty) {
        upperPlaceholders[3].style.display = 'none';
        userFormInputPhoneError.textContent = 'Укажите электронную почту'   
    }
    userFormInputPhoneError.style.display =
     (!isNotEmpty || isValid)   ? 'none' : 'block';

     if (!isNotEmpty || isValid) {
        userFormInputPhone.classList.remove('errorText')
        formLines[3].classList.remove('errorBlock')  
     }
    
    if (!isValid && isNotEmpty) {
        userFormInputPhoneError.textContent =
      'Формат: +9 999 999 99 99';
      userFormInputPhoneError.style.display = 'block';
      userFormInputPhone.classList.add('errorText')
      formLines[3].classList.add('errorBlock')
      
    }
 }

 const validatePhoneDebounced = debounce(validatePhone, 400);
 userFormInputPhone.addEventListener('input', validatePhoneDebounced)

    
  

const userFormInputInn = document.querySelector(".input__wrapper input[name='ИНН']")
const userFormInputInnError = document.querySelector(".error-placeholder.inn")


const validateInn = () => {
    const isValid = userFormInputInn.value.length <= 14;
    const isNotEmpty = userFormInputInn.value.length > 0;
    userFormInputInn.classList.remove('errorText')
    formLines[4].classList.remove('errorBlock')

    if (!isNotEmpty) {
        userFormInputInnError.textContent = 'Укажите ИНН'
        userFormInputInn.classList.remove('errorText')
        formLines[4].classList.remove('errorBlock')
        
       }

       
    userFormInputInnError.style.display =
     (!isNotEmpty || isValid)   ? 'none' : 'block';
    
    if (!isValid && isNotEmpty) {
        userFormInputInnError.textContent =
      'Проверьте ИНН';
      userFormInputInnError.style.display = 'block'
      userFormInputInn.classList.add('errorText')
        formLines[4].classList.add('errorBlock')
    }
 }

const validateInnDebounced = debounce(validateInn, 400);
userFormInputInn.addEventListener('input', validateInnDebounced)

    
const userForm = document.querySelector(".receiver__form")
const userFormSubmitButton = document.querySelector(".total__paybutton")

 userFormSubmitButton.addEventListener('click', () => {
    let errors = 0;
    for (let i=0; i < userFormInputs.length; i++) {
         if(userFormInputs[i].value.length === 0) {
            errorPlaceholders[i].style.display = 'block';
            userFormInputs[i].classList.add('errorText');
            formLines[i].classList.add('errorBlock');
         }   

         if(errorPlaceholders[i].style.display == 'block')  {
            errors++;
         }
    }
    (errors>0)  ?  userForm.scrollIntoView() :  alert('Заказ успешно оформлен!')
    
 }) 
