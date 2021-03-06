import React, { Component, PureComponent } from 'react';
// * instead of using higher order component (ex.redux connect(mapStateToProps, mapDispatchToProps)(ThisComponent) ), use this Query component (Render props)
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Item from './Item';
import Pagination from './Pagination';
import { perPage } from '../config';
import { ALL_ITEMS_QUERY } from '../gql/query';

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  @media only screen and (min-width: 850px) {
    grid-template-columns: 1fr 1fr;
  }
`;
const Center = styled.div`
  text-align: center;
`;

class Items extends PureComponent {
  render() {
    return (
      <Center>
        <Query
          query={ALL_ITEMS_QUERY}
          variables={{ skip: this.props.page * perPage - perPage }}
        >
          {/* the <Query> return a *payload*  destructing the payload to get the data, error, loading*/}
          {({ data, error, loading }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error: {error.message}</p>;
            return (
              <ItemsList>
                {data.items.map(item => (
                  <Item item={item} key={item.id} />
                ))}
              </ItemsList>
            );
          }}
        </Query>
        <Pagination page={this.props.page} />
      </Center>
    );
  }
}
export default Items;
