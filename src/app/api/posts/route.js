import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { posts } from '@/data/posts';
import Post from '@/models/Post';

export async function GET() {
  try {
    //mongodb 연결
    await connectDB();
    //post models 이용해 전체 글 조회, sort 문법을 이용해 생성일 기준의 내림차순 정렬 1을 오름차순, -1은 내림차순
    const posts = await Post.find({}).sort({ createdAt: -1 });

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: '게시글을 불러오는데 실패했습니다.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    if (!data.title || !data.content) {
      return NextResponse.json({ error: '제목과 내용은 필수입니다.' }, { status: 400 });
    }

    const newPost = await Post.create(data);

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: '게시글을 생성하는데 실패했습니다.' }, { status: 500 });
  }
}
