import { Col, InputNumber, Select, Slider } from 'antd'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import styles from '../styles.module.sass'

const { Option } = Select


export class PlantFilter extends Component {

    render() {
        const { 
            species, 
            handleSpecyCodeSelected, 
            inputMaxSlider, 
            inputMinSlider,
            min,max,
            onChangeInputMin,
            onChangeInputMax,
            onChangeSlider
        } = this.props
        return (
            <div 
            className = {styles.m5 + ' ' + styles.flex_space_center}
            style = {{width: '100%', height: '10vh', border: '.25px solid #2A9D8F'}}>
                <div style = {{}}
                    className = {styles.flex_center}
                >
                    <p className = {styles.h4 + ' ' + styles.m3}>Loại cây</p>
                    <Select defaultValue = "" style={{ width: 200 }} onChange={handleSpecyCodeSelected}>
                        <Option key = '' value = { -1 }>
                            <p></p>
                        </Option>
                        {species.map((specy, _) => {
                            return <Option key = {_}value = {specy.MALOAI}>{ specy.TENLOAI }</Option>
                        })}
                    </Select>
                </div>
                <div
                    className = {styles.flex_space_center}
                    style = {{width: '40vw'}}
                >
                    <p className = {styles.h4}>
                        Giá sản phẩm
                    </p>
                    <Col>
                        <InputNumber
                            min={min}
                            max={max}
                            step = {1000}
                            style={{ margin: '0 16px'}}
                            value={inputMinSlider}
                            onChange={onChangeInputMin}
                        />
                    </Col>
                        {inputMaxSlider === -1 ? 
                        <div>{-1}</div>
                        : (
                            <Col span={8}>
                                <Slider
                                    min={min}
                                    max={max}
                                    step = {1000}
                                    range
                                    onAfterChange={onChangeSlider}
                                    defaultValue = {[inputMinSlider, inputMaxSlider]}
                                />
                            </Col>
                        ) 
                    }
                    <Col>
                        <InputNumber
                            min={min}
                            max={max}
                            step = {1000}
                            style={{ margin: '0 16px' }}
                            value={inputMaxSlider}
                            onChange={onChangeInputMax}
                        />
                    </Col>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const { species } = state.product

    return { species }
}

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(PlantFilter)
