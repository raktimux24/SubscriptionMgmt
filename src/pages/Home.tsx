import React from 'react';
import { Hero } from '../components/home/Hero';
import { ValueProposition } from '../components/home/ValueProposition';
import { Features } from '../components/home/Features';
import { Testimonials } from '../components/home/Testimonials';

export default function Home() {
  return (
    <main>
      <Hero />
      <ValueProposition />
      <Features />
      <Testimonials />
    </main>
  );
}
