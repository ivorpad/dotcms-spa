import React from 'react';
import PropTypes from 'prop-types';
import ItemLink from './ItemLink';

const NavOption = ({ item }) => {
    return (
        <ItemLink key={item.folder} className="rd-nav-link" pathname={item.href}>
            {item.title}
        </ItemLink>
    );
};

NavOption.propTypes = {
    item: PropTypes.shape({
        folder: PropTypes.string,
        href: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired
    }).isRequired
};

export default NavOption;
