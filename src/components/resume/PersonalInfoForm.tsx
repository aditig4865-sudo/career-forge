import React, { useState, useEffect } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Input } from '../ui/Input';
import { Country, State, City } from 'country-state-city';
import CreatableSelect from 'react-select/creatable';

export function PersonalInfoForm() {
  const { data, updateData } = useResume();
  const { personalInfo } = data;

  const [countryName, setCountryName] = useState('');
  const [stateName, setStateName] = useState('');
  const [cityName, setCityName] = useState('');

  const [countryCode, setCountryCode] = useState('');
  const [stateCode, setStateCode] = useState('');

  const [phonePrefix, setPhonePrefix] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Parse existing location if it exists
  useEffect(() => {
    if (personalInfo.location) {
      const parts = personalInfo.location.split(',').map(s => s.trim());
      if (parts.length >= 3) {
        // format: City, State, Country
        const country = Country.getAllCountries().find(c => c.name === parts[2] || c.isoCode === parts[2]);
        setCountryName(parts[2]);
        if (country) {
          setCountryCode(country.isoCode);
          const state = State.getStatesOfCountry(country.isoCode).find(s => s.name === parts[1]);
          setStateName(parts[1]);
          if (state) {
            setStateCode(state.isoCode);
          }
        } else {
          setStateName(parts[1]);
        }
        setCityName(parts[0]);
      } else if (parts.length === 2) {
        // format: City, State
        const allStates = State.getAllStates();
        const stateObj = allStates.find(s => s.name === parts[1]);
        setStateName(parts[1]);
        if (stateObj) {
          setStateCode(stateObj.isoCode);
          const countryObj = Country.getCountryByCode(stateObj.countryCode);
          if (countryObj) {
            setCountryCode(countryObj.isoCode);
            setCountryName(countryObj.name);
          }
        }
        setCityName(parts[0]);
      } else {
        setCityName(personalInfo.location);
      }
    }
    
    // Parse existing phone
    if (personalInfo.phone) {
      const p = personalInfo.phone;
      if (p.includes(' ')) {
        const parts = p.split(' ');
        setPhonePrefix(parts[0]);
        setPhoneNumber(parts.slice(1).join(' '));
      } else {
        setPhoneNumber(p);
      }
    }
  }, []); // Run once on mount

  // Sync Location
  useEffect(() => {
    const parts = [];
    if (cityName) parts.push(cityName);
    if (stateName) parts.push(stateName);
    if (countryName) parts.push(countryName);
    
    const newLocation = parts.join(', ');
    if (newLocation !== personalInfo.location) {
      updateData({
        personalInfo: {
          ...personalInfo,
          location: newLocation
        }
      });
    }
  }, [cityName, stateName, countryName, personalInfo.location, updateData]);

  // Sync Phone
  useEffect(() => {
    // Validate phone
    if (phoneNumber && phoneNumber.replace(/\D/g, '').length !== 10) {
      setPhoneError('Phone number must be exactly 10 digits.');
    } else {
      setPhoneError('');
    }

    if (phoneNumber) {
      const newPhone = `${phonePrefix} ${phoneNumber}`;
      if (newPhone !== personalInfo.phone) {
        updateData({
          personalInfo: {
            ...personalInfo,
            phone: newPhone
          }
        });
      }
    }
  }, [phonePrefix, phoneNumber, personalInfo.phone, updateData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'email') {
      const email = e.target.value;
      if (email && !email.endsWith('@gmail.com')) {
        setEmailError('Email must end with @gmail.com');
      } else {
        setEmailError('');
      }
    }

    updateData({
      personalInfo: {
        ...personalInfo,
        [e.target.name]: e.target.value
      }
    });
  };

  const customStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: 'var(--color-surface-elevation)',
      borderColor: 'var(--color-structural-border)',
      color: 'white'
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: 'var(--color-surface-elevation)',
      border: '1px solid var(--color-structural-border)',
      zIndex: 9999
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? 'var(--color-primary)' : 'transparent',
      color: 'white',
      cursor: 'pointer'
    }),
    singleValue: (base: any) => ({
      ...base,
      color: 'white'
    }),
    input: (base: any) => ({
      ...base,
      color: 'white'
    })
  };

  const countryOptions = Country.getAllCountries().map(c => ({ label: c.name, value: c.isoCode }));
  const phonePrefixOptions = Country.getAllCountries().map(c => ({
    label: `${c.flag} +${c.phonecode} (${c.name})`,
    value: `+${c.phonecode}`
  })).filter((v, i, a) => a.findIndex(t => (t.value === v.value)) === i); // remove duplicates by value

  const stateOptions = countryCode ? State.getStatesOfCountry(countryCode).map(s => ({ label: s.name, value: s.isoCode })) : [];
  const cityOptions = (countryCode && stateCode) ? City.getCitiesOfState(countryCode, stateCode).map(c => ({ label: c.name, value: c.name })) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <Input label="Full Name" name="fullName" value={personalInfo.fullName} onChange={handleChange} placeholder="Your Full Name" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
        <Input 
          label="Email" 
          name="email" 
          type="email" 
          value={personalInfo.email} 
          onChange={handleChange} 
          placeholder="yourname@gmail.com" 
          error={emailError}
        />
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Phone</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ width: '160px' }}>
              <CreatableSelect
                styles={customStyles}
                value={phonePrefixOptions.find(o => o.value === phonePrefix) || { label: phonePrefix, value: phonePrefix }}
                options={phonePrefixOptions}
                onChange={(selectedOption: any) => {
                  if (selectedOption) setPhonePrefix(selectedOption.value);
                }}
                placeholder="+91"
              />
            </div>
            <div style={{ flex: 1 }}>
              <Input 
                name="phoneLocal" 
                value={phoneNumber} 
                onChange={(e) => {
                  // Only allow digits
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 10) setPhoneNumber(val);
                }} 
                placeholder="11111 11111"
                error={phoneError}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-md)' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Country</label>
          <CreatableSelect
            isClearable
            styles={customStyles}
            value={countryName ? { label: countryName, value: countryCode || countryName } : null}
            options={countryOptions}
            onChange={(selectedOption: any) => {
              if (selectedOption) {
                setCountryName(selectedOption.label);
                setCountryCode(selectedOption.__isNew__ ? '' : selectedOption.value);
              } else {
                setCountryName('');
                setCountryCode('');
              }
              setStateName('');
              setStateCode('');
              setCityName('');
            }}
            placeholder="Type or select..."
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>State</label>
          <CreatableSelect
            isClearable
            styles={customStyles}
            value={stateName ? { label: stateName, value: stateCode || stateName } : null}
            options={stateOptions}
            onChange={(selectedOption: any) => {
              if (selectedOption) {
                setStateName(selectedOption.label);
                setStateCode(selectedOption.__isNew__ ? '' : selectedOption.value);
              } else {
                setStateName('');
                setStateCode('');
              }
              setCityName('');
            }}
            placeholder="Type or select..."
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>City</label>
          <CreatableSelect
            isClearable
            styles={customStyles}
            value={cityName ? { label: cityName, value: cityName } : null}
            options={cityOptions}
            onChange={(selectedOption: any) => {
              if (selectedOption) {
                setCityName(selectedOption.label);
              } else {
                setCityName('');
              }
            }}
            placeholder="Type or select..."
          />
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
        <Input label="Portfolio / Website" name="portfolio" value={personalInfo.portfolio} onChange={handleChange} placeholder="yourwebsite.com" />
        <Input label="LinkedIn" name="linkedin" value={personalInfo.linkedin} onChange={handleChange} placeholder="linkedin.com/in/yourname" />
      </div>
    </div>
  );
}
