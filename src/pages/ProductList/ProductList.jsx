import { Button } from 'antd'
import React, { Component } from 'react'

import styles from '../styles.module.sass'
import ProductCard from '../../components/ProductCard/ProductCard'
import { connect } from 'react-redux'
import PlantFilter from '../../components/PlantFilter/PlantFilter'

import { setKeyforSidebar, setPathForSidebar} from '../../redux/features/Sidebar/SidebarSlice'
import { withRouter } from 'react-router-dom'

class ProductList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            currentPage: 1,
            specyCode: -1,
            min: -1,
            max: -1,
            inputMinSlider: -1,
            inputMaxSlider: -1,
        }
    }

    async componentDidMount() {
        const {plants, setPathForSidebar, setKeyforSidebar, location} = this.props
        let min = 999999, max = 0
        
        plants.forEach((plant) => {
            // if(plant.GIANIEMYET.localeCompare(max))
            //     max = plant.GIANIEMYET
            // else if(plant.GIANIEMYET.localeCompare(min) === -1) 
            //     min = plant.GIANIEMYET

            if(parseInt(plant.GIANIEMYET) > max)
                max = parseInt(plant.GIANIEMYET)
            
            if(parseInt(plant.GIANIEMYET) < min)
                min = parseInt(plant.GIANIEMYET)
        })

        this.setState({ 
            min: min,
            inputMinSlider: min,
            max: max,
            inputMaxSlider: max,
        })

        setPathForSidebar( {pathname: location.pathname })
        setKeyforSidebar( { submenu: '0',  key : 'cc'})
    }

    handleChangePagination = (page) => {
        console.log(page)
        this.setState({currentPage: page});
        window.scrollTo(0, 0)
    }

    handleSpecyCodeSelected = (value) => {
        this.setState({specyCode: value})
      }

      onChangeSlider = (value) => {
          this.setState({
            inputMaxSlider: value[1], 
            inputMinSlider: value[0]
        })
      }

      onChangeInputMax = (value) => {
          const {max} = this.state
          if(typeof value === 'number' && value <= max) {
              this.setState ({inputMaxSlider: value})
          } else 
          this.setState({inputMaxSlider: max})
      }
      onChangeInputMin = (value) => {
          const { min } = this.state
          if(typeof value === 'number' && value <= min) {
              this.setState ({inputMinSlider: value})
          } else 
          this.setState({inputMinSlider: min})
      }
      
    render() {
        const { 
            currentPage,
            min,
            max, 
            specyCode, 
            inputMaxSlider, 
            inputMinSlider } = this.state
        const { plants } = this.props
        const pagination = []

        
        var filterdPlants = plants.filter((plant) => {
            return (plant.MALOAI[0] === specyCode || specyCode === -1)
                        && plant.GIANIEMYET >= inputMinSlider && plant.GIANIEMYET <= inputMaxSlider
                        
        })

        const total = Math.ceil(filterdPlants.length / 9)
        for (let index = 1; index <= total; index++) {
                let className = index === currentPage ? styles.fbackground : '' ;
                pagination.push(
                    <Button type = "primary"
                        htmlType = 'button' key = {index}
                        className = {className}
                        style = {{margin: '5px', width: '48px', height: '48px'}}
                        onClick = {() => this.handleChangePagination(index)}
                        >
                        {index}
                    </Button>
                )            
        }
        return (
            <div className = {styles.flex_start_center}>
                <PlantFilter 
                    handleSpecyCodeSelected = { 
                        this.handleSpecyCodeSelected 
                    }
                    min = {min}
                    max = {max}
                    
                    inputMinSlider = {inputMinSlider ? inputMinSlider : min}
                    inputMaxSlider = {inputMaxSlider ? inputMaxSlider : max}
                    
                    onChangeSlider = {this.onChangeSlider}
                    onChangeInputMax = {this.onChangeInputMax}
                    onChangeInputMin = {this.onChangeInputMin}
                    />  
                {
                    filterdPlants.length !== 0
                    ? (
                        filterdPlants.map((plant, index) =>
                            ((
                            index < currentPage * 9) 
                            && index >= (currentPage - 1) * 9 ) ? (
                                <ProductCard plant = {plant} key = {index}/>
                            ): null
                        ))
                    : null
                }
                {
                <div style = {{width:'100%'}} className = {styles.flex_center + ' ' + styles.m5}>
                    {pagination}
                </div>
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    const {plants} = state.product
    
    return {plants}
}

const mapDispatchToProps = {
    setPathForSidebar,
    setKeyforSidebar
}

export default connect(mapStateToProps, mapDispatchToProps)( withRouter (ProductList))