import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from './features/posts/postsSlice';
import Tree from 'react-d3-tree';

const MindMap = () => {
    const { data: posts } = useSelector((state) => state.posts);
    const dispatch = useDispatch();
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const [translate, setTranslate] = useState({
        x: window.innerWidth / 2,
        y: 100, 
    });

    useEffect(() => {
        dispatch(fetchPosts());

        const handleResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
            setTranslate({ x: window.innerWidth / 2, y: 100 });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [dispatch]);

 
    const treeData = useMemo(() => {
        if (!posts.length) return { name: 'No Data' };

        return {
            name: posts[0].title,
            attributes: { body: posts[0].body },
            children: posts.slice(1, 6).map((post) => ({
                name: post.title,
                attributes: { body: post.body },
            })),
        };
    }, [posts]);

    return (
        <div style={{
            marginTop: 20,
            width: '100%',
            height: '100vh',
            overflow: 'auto', 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid #ccc',
            backgroundColor: '#f9f9f9',
            padding: '10px',
        }}>
            <Tree
                data={treeData}
                orientation="vertical"
                translate={translate} 
                pathFunc="step"
                nodeSize={{ x: dimensions.width < 768 ? 150 : 200, y: 100 }} 
                separation={{ siblings: 1.2, nonSiblings: 2 }}
                renderCustomNodeElement={({ nodeDatum, toggleNode }) => (
                    <g>
                        <circle r={10} fill="#007bff" onClick={toggleNode} cursor="pointer" />
                        <text x={20} y={5} fill="black" fontSize="16">
                            {nodeDatum.name}
                        </text>
                        <text x={20} y={20} fill="gray" fontSize="10">
                            {nodeDatum.attributes?.body?.substring(0, 30) || 'No body text'}...
                        </text>
                    </g>
                )}
            />
        </div>
    );
};

export default MindMap;
