
import React from 'react';
import { UserPlus, UserCheck, ExternalLink } from 'lucide-react';
import { Channel } from '../types';

interface ChannelCardProps {
  channel: Channel;
  onFollow: (id: string) => void;
  onClick: (id: string) => void;
}

const ChannelCard: React.FC<ChannelCardProps> = ({ channel, onFollow, onClick }) => {
  return (
    <div 
      onClick={() => onClick(channel.id)}
      className="bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-sm transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer group"
    >
      <div className="h-28 bg-gray-100 relative">
        <img src={channel.banner} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <ExternalLink className="text-white" size={24} />
        </div>
        <div className="absolute -bottom-7 left-5">
          <img src={channel.owner.avatar} alt="" className="w-14 h-14 rounded-2xl border-4 border-white shadow-md object-cover" />
        </div>
      </div>
      <div className="p-5 pt-10">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-gray-800 text-[15px] group-hover:text-[#00ADEF] transition-colors">{channel.name}</h3>
            <p className="text-[11px] text-[#00ADEF] font-bold">@{channel.owner.name.toLowerCase().replace(' ', '')}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFollow(channel.id);
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold transition-all shadow-sm ${
              channel.isFollowing
                ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                : 'bg-[#00ADEF] text-white hover:bg-[#0095CC] shadow-[#00ADEF]/20'
            }`}
          >
            {channel.isFollowing ? <UserCheck size={14} /> : <UserPlus size={14} />}
            {channel.isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>
        <p className="text-[12px] text-gray-500 mb-5 line-clamp-2 font-medium leading-relaxed">{channel.description}</p>
        <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] font-bold text-gray-800">{(channel.followers / 1000).toFixed(1)}k</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">followers</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelCard;
