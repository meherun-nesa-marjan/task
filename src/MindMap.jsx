import  { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from './features/posts/postsSlice';
import Tree from 'react-d3-tree';

const MindMap = () => {
    const { data: posts } = useSelector((state) => state.posts);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    const transformToTree = (posts) => {
        if (posts.length === 0) return { name: 'No Data' }; 
        const root = {
          name: posts[0].title,
          attributes: {
            body: posts[0].body, 
          },
          children: posts.slice(1).map((post) => ({
            name: post.title, 
            attributes: {
              body: post.body, 
            },
          })),
        };
    
        return root;
    };
   
   

    const treeData = posts.length ? transformToTree(posts) : null;

    return (
       <div className="">
          <div style={{ width: '100%', height: '100vh', border: '1px solid #ccc', marginTop: 20 }}>
          <Tree
            data={treeData} 
            orientation="vertical" 
            translate={{ x: window.innerWidth / 2, y: 50 }} 
            pathFunc="step" 
            nodeSize={{ x: 200, y: 100 }} 
            separation={{ siblings: 1, nonSiblings: 2 }} 
            renderCustomNodeElement={({ nodeDatum, toggleNode }) => (
              <g>
                <circle r={10} fill="#007bff" onClick={toggleNode} />
                <text x={20} y={5} fill="black" fontSize="12">
                  {nodeDatum.name}
                </text>
                <text x={20} y={20} fill="gray" fontSize="10">
                  {nodeDatum.attributes?.body?.substring(0, 30) || 'No body text'}...
                </text>
              </g>
            )}
          />
        </div>
       </div>
    );
};

export default MindMap;
