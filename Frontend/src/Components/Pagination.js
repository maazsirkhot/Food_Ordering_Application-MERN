import React, { Component } from 'react';


class Pagination extends Component{
    
    render(){
        const pageNumbers = [];

        for (let i = 1; i <= Math.ceil(this.props.totalPosts / this.props.postsPerPage); i++) {
            pageNumbers.push(i);
        }
        console.log(pageNumbers, this.props);

        return (
            <div>
              <ul className='pagination'>
                {pageNumbers.map(number => (
                  <li key={number} className='page-item'>
                    <a onClick={() => this.props.paginate(number)} className='page-link'>
                      {number}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          );
    }
}


export default Pagination;