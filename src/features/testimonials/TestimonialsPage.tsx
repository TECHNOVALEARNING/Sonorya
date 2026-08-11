import React from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { TestimonialReview } from '../../types/melodia';

export const TESTIMONIALS_DATA: TestimonialReview[] = [
  {
    id: 'rev-1',
    authorName: 'Aïchatou & Rodrigue',
    location: 'Cotonou, Bénin',
    occasion: 'Mariage',
    rating: 5,
    comment: 'On a diffusé la chanson pendant l\'entrée des mariés. Tout le monde pensait qu\'on avait engagé un vrai groupe de musique en studio !',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    date: '03 août 2026'
  },
  {
    id: 'rev-2',
    authorName: 'Kofi Mensah',
    location: 'Lomé, Togo',
    occasion: 'Dot',
    rating: 5,
    comment: 'Pour la dot de ma sœur, la chanson racontait toute l\'histoire des deux familles. Beaucoup de larmes d\'émotion et de joie.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    date: '30 juillet 2026'
  },
  {
    id: 'rev-3',
    authorName: 'Maman Chantal',
    location: 'Abidjan, Côte d\'Ivoire',
    occasion: 'Réussite scolaire',
    rating: 5,
    comment: 'Mon fils a eu son BAC avec mention très bien, je lui ai offert une chanson Gospel/Afrobeat personnalisée. Il l\'écoute en boucle !',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    date: '25 juillet 2026'
  }
];

export const TestimonialsPage: React.FC = () => {
  return (
    <div>
      <h2 style={{ fontSize: 24, marginBottom: 4 }}>Avis & Témoignages Clients</h2>
      <p style={{ color: 'var(--ivory-dim)', fontSize: 14, marginBottom: 24 }}>
        Découvrez ce que disent nos utilisateurs à travers l'Afrique et le monde.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {TESTIMONIALS_DATA.map((t) => (
          <div key={t.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <img src={t.avatarUrl} alt={t.authorName} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{t.authorName}</div>
                  <div style={{ fontSize: 12, color: 'var(--ivory-dim)' }}>{t.location} · {t.occasion}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 4, color: '#F59E0B', marginBottom: 10 }}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} fill="#F59E0B" />
                ))}
              </div>

              <p style={{ fontSize: 13.5, fontStyle: 'italic', color: 'var(--ivory)', lineHeight: 1.6 }}>
                "{t.comment}"
              </p>
            </div>

            <div style={{ fontSize: 11.5, color: 'var(--ivory-muted)', marginTop: 14 }}>
              Posté le {t.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
