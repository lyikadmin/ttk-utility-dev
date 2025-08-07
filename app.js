document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('jwt-form');
  const output = document.getElementById('output-content');
  const getTokenForm = document.getElementById('get-token-form');
  const createTravellerForm = document.getElementById('create-traveller-form');
  const assignUserForm = document.getElementById('assign-user-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = form.userId.value.trim();
    const accessType = form.accessType.value.trim();
    const fullName = form.fullName.value.trim();
    const orderId = form.orderId.value.trim();

    if (!userId) {
      output.textContent = 'User ID is required.';
      return;
    }

    output.textContent = 'Generating token...';

    try {
      const response = await fetch('http://localhost:9080/generate-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, accessType, fullName, orderId }),
      });
      if (!response.ok) {
        const error = await response.json();
        output.textContent = 'Error: ' + (error.detail || response.statusText);
        return;
      }
      const data = await response.json();
      output.textContent = data.token;
    } catch (err) {
      output.textContent = 'Error: ' + err;
    }
  });

  if (getTokenForm) {
    getTokenForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const apiToken = getTokenForm.apiToken.value.trim();
      if (!apiToken) {
        output.textContent = 'Token is required.';
        return;
      }
      output.textContent = 'Calling Get Token API...';
      try {
        const response = await fetch(window.BASE_URL_UAT + '/api/v1/auth/get-token', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + apiToken,
            'Content-Type': 'application/json',
          },
        });
        const text = await response.text();
        // Try to pretty print JSON if possible
        try {
          output.textContent = JSON.stringify(JSON.parse(text), null, 2);
        } catch {
          output.textContent = text;
        }
      } catch (err) {
        output.textContent = 'Error: ' + err;
      }
    });
  }

  if (createTravellerForm) {
    createTravellerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const token = createTravellerForm.travellerToken.value.trim();
      const formUri = createTravellerForm.formUri.value.trim();
      const action = createTravellerForm.travellerAction.value.trim();
      if (!token) {
        output.textContent = 'Token is required.';
        return;
      }
      if (!formUri) {
        output.textContent = 'Form URI is required.';
        return;
      }
      if (!action) {
        output.textContent = 'Action is required.';
        return;
      }
      output.textContent = 'Creating traveller...';
      const payloadObj = {
        "visa_request_information": {
          "visa_request": {
            "traveller_type": createTravellerForm.travellerType.value,
            "order_id": createTravellerForm.travellerOrderId.value,
            "traveller_id": createTravellerForm.travellerId.value,
            "visa_processing_type": createTravellerForm.visaProcessingType.value,
            "no_of_entries": createTravellerForm.noOfEntries.value,
            "no_of_travellers": parseInt(createTravellerForm.noOfTravellers.value),
            "from_country": createTravellerForm.fromCountry.value,
            "to_country": createTravellerForm.toCountry.value,
            "arrival_date": createTravellerForm.arrivalDate.value,
            "departure_date": createTravellerForm.departureDate.value,
            "length_of_stay": parseInt(createTravellerForm.lengthOfStay.value),
            "validity": parseInt(createTravellerForm.validity.value),
            "visa_type": createTravellerForm.visaType.value,
            "visa_mode": createTravellerForm.visaMode.value,
            "phone_number": createTravellerForm.phoneNumber.value,
            "email_id": createTravellerForm.emailId.value
          }
        }
      };
      const formData = new FormData();
      formData.append('payload', JSON.stringify(payloadObj));
      try {
        const response = await fetch(window.BASE_URL_UAT + '/api/v1/forms/' + formUri + '?action=' + action, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + token
            // Do NOT set Content-Type, browser will set it for FormData
          },
          body: formData,
        });
        const text = await response.text();
        // Try to pretty print JSON if possible
        try {
          output.textContent = JSON.stringify(JSON.parse(text), null, 2);
        } catch {
          output.textContent = text;
        }
      } catch (err) {
        output.textContent = 'Error: ' + err;
      }
    });
  }

  if (assignUserForm) {
    assignUserForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const mode = assignUserForm.assignMode.value.trim();
      const recordId = assignUserForm.assignRecordId.value.trim();
      const formUri = assignUserForm.assignFormUri.value.trim();
      const token = assignUserForm.assignToken.value.trim();
      const userId = assignUserForm.assignUserId.value.trim();
      if (!mode || !recordId || !formUri || !token || !userId) {
        output.textContent = 'All fields are required.';
        return;
      }
      output.textContent = 'Assigning user...';
      try {
        const response = await fetch(
          window.BASE_URL_UAT + `/api/v1/mgmt/forms/${formUri}/owners?mode=${mode}&record_id=${recordId}`,
          {
            method: 'PATCH',
            headers: {
              'accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify([userId]),
          }
        );
        const text = await response.text();
        try {
          output.textContent = JSON.stringify(JSON.parse(text), null, 2);
        } catch {
          output.textContent = text;
        }
      } catch (err) {
        output.textContent = 'Error: ' + err;
      }
    });
  }
});