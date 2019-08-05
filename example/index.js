import React, { useState } from 'react';
import { storiesOf, action } from '@storybook/react';
// import { InputAddress, FullAddress } from '../src/index';
import { InputAddress } from '../lib/index'

// import '../src/styles.css';


class CustomFullAddress extends React.Component {
  state = {
    address: {},
  }
  onChange = this.onChange.bind(this)
  onSelected = this.onSelected.bind(this)

  onChange(e) {
    this.setState({
      [e.name]: e.value
    })
  }

  onSelected(fullAddress) {
    const { district, amphoe, province, zipcode } = fullAddress
    console.log(fullAddress)
    this.setState({
      district,
      amphoe,
      province,
      zipcode
    })
  }

  render() {
    return (
      <div>
        <InputAddress onSelected={this.onSelected} onChange={this.onChange} value={this.state.district} type="district" name="ตำบล" placeholder="ตำบล" />
        <InputAddress onSelected={this.onSelected} onChange={this.onChange} value={this.state.amphoe} type="amphoe" name="อำเภอ" />
        <InputAddress onSelected={this.onSelected} onChange={this.onChange} value={this.state.province} type="province" name="จังหวัด" />
        <InputAddress onSelected={this.onSelected} onChange={this.onChange} value={this.state.zipcode} type="zipcode" name="รหัสไปรษณีย์" />
      </div>
    )
  }
}


storiesOf('Component', module)
  .add('full address', () => {
    return (
      <div style={{ width: 350 }}>
        <CustomFullAddress />
      </div>
    )
  })

