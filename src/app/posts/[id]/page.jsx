'use client';

import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { use, useEffect, useState } from 'react';

const PostDetailPage = ({ params }) => {
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  // params = Promise ({ id: '1' })
  // use() 훅을 사용하여 unWrap 하기
  // resolvedParams = { id: '1' }
  const resolvedParams = use(params);

  useEffect(() => {
    // 게시글 불러오기
    axios
      .get(`/api/posts/${resolvedParams._id}`)
      .then((res) => {
        setPost(res.data);
        setLoading(false);
      })
      .catch(() => {
        console.error(error);
        setLoading(false);
      });
  }, [resolvedParams._id, router]);

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      const res = await axios.delete(`/api/posts/${resolvedParams._id}`);

      //삭제 성공 시 목록으로 이동
      if (res.status === 200) {
        router.push('/posts');
        alert('게시글 삭제를 했습니다.');
      } else {
        alert('게시글 삭제에 실패했습니다.');
      }
    } catch (error) {
      alert('오류가 발생 했습니다.');
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }
  if (!post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <div className='container mx-auto py-10'>
      <div className='text_container flex flex-col min-h-screen relative'>
        <h2 className='text-4xl font-black'>{post.title}</h2>
        <p className='text-xl '>{post.content}</p>
        <span className='text-gray-400 absolute top-0 right-0'>{post.createdAt}</span>
      </div>
      <div className='flex border-t-2 py-3 gap-5'>
        <Link href={'/posts'}>목록</Link>
        <Link href={`/posts/${resolvedParams._id}/edit`} className='ml-auto'>
          수정
        </Link>
        <button onClick={handleDelete}>삭제</button>
      </div>
    </div>
  );
};

export default PostDetailPage;
