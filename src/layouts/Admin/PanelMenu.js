import React from 'react';
import { Tree } from 'primereact/tree';
import { NextLink } from 'next/link';
import Link from 'next/link';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

const SidebarMenu = () => {
  const nodes = [
    {
      key: 'home',
      label: 'Home',
      icon: 'pi pi-home',
      link: '/dashboard/product/mtrsubgroup'
    },
    {
      key: 'products',
      label: 'Products',
      icon: 'pi pi-shopping-cart',
      children: [
        {
          key: 'category1',
          label: 'Category 1',
          children: [
            {
              key: 'product1',
              label: 'Product 1.1',
              link: '/products/1'
            },
            {
              key: 'product2',
              label: 'Product 1.2',
              link: '/products/2'
            }
          ]
        },
        {
          key: 'category2',
          label: 'Category 2',
          children: [
            {
              key: 'product3',
              label: 'Product 2.1',
              link: '/products/3'
            },
            {
              key: 'product4',
              label: 'Product 2.2',
              link: '/products/4'
            }
          ]
        }
      ]
    },
    {
      key: 'contact',
      label: 'Contact',
      icon: 'pi pi-envelope',
      link: '/contact'
    }
  ];

 
  const renderNode = (node) => {
    if (node.link) {
      return (
        <Link href={node.link} key={node.key}>
          {node.label}
        </Link>
      );
    }

    return (
      <span>{node.label}</span>
    );
  };

  const renderNodes = (nodeList) => {
    return nodeList.map((node) => {
      return {
        key: node.key,
        label: renderNode(node),
        icon: node.icon,
        children: node.children ? renderNodes(node.children) : null
      };
    });
  };

 
  const {isSidebarOpen} = useSelector(state => state.user)
  const renderedNodes = renderNodes(nodes);
  
  console.log('sefseff' + isSidebarOpen)
  return (
    <Container>
        {isSidebarOpen ? <Tree value={renderedNodes} />: <IconContent />}
    </Container>
  );
};


const IconContent = () => {
    return (
       <div className='icons-container'>
         <div className='iconcontent'>
            <span className="p-tree-icon pi pi-home"></span>
        </div>
         <div className='iconcontent'>
            <span className="p-tree-icon pi pi-shopping-cart"></span>
        </div>
         <div className='iconcontent'>
            <span className="p-tree-icon pi pi-envelope"></span>
        </div>
       </div>
    )
}


const Container = styled.div`
    .p-tree {
        border: none;
        padding: 0;
    }

    .icons-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .iconcontent {
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`
export default SidebarMenu;