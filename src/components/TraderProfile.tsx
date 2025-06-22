import React, { useState } from 'react';
import { User, UserPlus, UserCheck, MessageCircle, Heart, Calendar, TrendingUp, TrendingDown, Settings } from 'lucide-react';
import { useTrades } from '../hooks/useTrades';
import { useComments } from '../hooks/useComments';
import { useFollows } from '../hooks/useFollows';
import { useAuth } from '../hooks/useAuth';
import { formatNumber, formatPercentage, formatDate } from '../utils/format';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ProfileEditModal } from './ProfileEditModal';

interface TraderProfileProps {
  trader: {
    id: string;
    username: string;
    wallet_address: string;
    avatar_url: string | null;
    bio: string | null;
    total_volume: number;
    total_trades: number;
    win_rate: number;
    roi: number;
    followers_count: number;
    following_count: number;
    created_at: string;
  };
  onClose: () => void;
  onTraderUpdate?: (updatedTrader: any) => void;
}

export const TraderProfile: React.FC<TraderProfileProps> = ({ trader, onClose, onTraderUpdate }) => {
  const { user } = useAuth();
  const { trades, loading: tradesLoading } = useTrades(trader.id);
  const { comments, loading: commentsLoading, addComment, likeComment } = useComments(trader.id);
  const { 
    followTrader, 
    unfollowTrader, 
    toggleAutoCopy, 
    isFollowing, 
    getAutoCopyStatus 
  } = useFollows(user?.id);
  
  const [currentTrader, setCurrentTrader] = useState(trader);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const isUserFollowing = isFollowing(currentTrader.id);
  const autoCopyEnabled = getAutoCopyStatus(currentTrader.id);
  const isOwnProfile = user?.id === currentTrader.id;

  const handleFollow = async () => {
    if (!user) return;
    
    setFollowLoading(true);
    try {
      if (isUserFollowing) {
        await unfollowTrader(user.id, currentTrader.id);
      } else {
        await followTrader(user.id, currentTrader.id);
      }
    } catch (err) {
      console.error('Follow error:', err);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleAutoCopyToggle = async () => {
    if (!user || !isUserFollowing) return;
    
    try {
      await toggleAutoCopy(user.id, currentTrader.id, !autoCopyEnabled);
    } catch (err) {
      console.error('Auto-copy toggle error:', err);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim() || !user) return;
    
    setSubmittingComment(true);
    try {
      await addComment(newComment.trim(), user.id);
      setNewComment('');
    } catch (err) {
      console.error('Comment error:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      await likeComment(commentId);
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleProfileUpdate = (updatedTrader: any) => {
    setCurrentTrader(updatedTrader);
    if (onTraderUpdate) {
      onTraderUpdate(updatedTrader);
    }
  };

  // Mock performance data for chart
  const performanceData = [
    { date: '2024-01', pnl: 0 },
    { date: '2024-02', pnl: 12.5 },
    { date: '2024-03', pnl: 8.2 },
    { date: '2024-04', pnl: 15.8 },
    { date: '2024-05', pnl: 22.3 },
    { date: '2024-06', pnl: 18.9 },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-lg border border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                  {currentTrader.avatar_url ? (
                    <img src={currentTrader.avatar_url} alt={currentTrader.username} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-xl font-bold">
                      {currentTrader.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{currentTrader.username}</h2>
                  <p className="text-gray-400">{currentTrader.wallet_address.slice(0, 8)}...{currentTrader.wallet_address.slice(-6)}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-400">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Joined {formatDate(currentTrader.created_at)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {isOwnProfile && (
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
                {user && !isOwnProfile && (
                  <button
                    onClick={handleFollow}
                    disabled={followLoading}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                      isUserFollowing
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {followLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : isUserFollowing ? (
                      <UserCheck className="w-4 h-4" />
                    ) : (
                      <UserPlus className="w-4 h-4" />
                    )}
                    <span>{isUserFollowing ? 'Following' : 'Follow'}</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white p-2"
                >
                  ✕
                </button>
              </div>
            </div>
            
            {currentTrader.bio && (
              <p className="text-gray-300 mt-4">{currentTrader.bio}</p>
            )}
          </div>

          <div className="p-6 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-sm text-gray-400">ROI</div>
                <div className={`text-xl font-bold ${currentTrader.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatPercentage(currentTrader.roi)}
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-sm text-gray-400">Win Rate</div>
                <div className="text-xl font-bold text-white">{formatPercentage(currentTrader.win_rate)}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-sm text-gray-400">Volume</div>
                <div className="text-xl font-bold text-white">${formatNumber(currentTrader.total_volume)}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-sm text-gray-400">Followers</div>
                <div className="text-xl font-bold text-white">{formatNumber(currentTrader.followers_count)}</div>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Performance Chart</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="pnl" 
                      stroke="#8B5CF6" 
                      strokeWidth={2}
                      dot={{ fill: '#8B5CF6', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Auto Copy Toggle */}
            {user && isUserFollowing && (
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Auto Copy Trades</h4>
                    <p className="text-sm text-gray-400">Automatically copy this trader's swaps</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoCopyEnabled}
                      onChange={handleAutoCopyToggle}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            )}

            {/* Recent Trades */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Trades</h3>
              {tradesLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {trades.slice(0, 5).map((trade) => (
                    <div key={trade.id} className="flex items-center justify-between bg-gray-900/50 rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${trade.pnl && trade.pnl > 0 ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        <div>
                          <div className="text-white font-medium">
                            {trade.input_token} → {trade.output_token}
                          </div>
                          <div className="text-sm text-gray-400">
                            {formatDate(trade.timestamp)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">
                          ${formatNumber(trade.input_amount)}
                        </div>
                        {trade.pnl && (
                          <div className={`text-sm ${trade.pnl > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {trade.pnl > 0 ? '+' : ''}{formatPercentage(trade.pnl)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Comments</h3>
              <div className="space-y-4">
                {user && (
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                    />
                    <button
                      onClick={handleComment}
                      disabled={submittingComment || !newComment.trim()}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors disabled:cursor-not-allowed"
                    >
                      {submittingComment ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                )}
                
                {commentsLoading ? (
                  <div className="flex items-center justify-center h-20">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-900/50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full overflow-hidden">
                            {comment.commenter?.avatar_url ? (
                              <img src={comment.commenter.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-r from-green-500 to-blue-500"></div>
                            )}
                          </div>
                          <span className="text-sm font-medium text-white">
                            {comment.commenter?.username || 'Anonymous'}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-2">{comment.content}</p>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleLikeComment(comment.id)}
                            className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <Heart className="w-4 h-4" />
                            <span className="text-xs">{comment.likes_count}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                    {comments.length === 0 && (
                      <p className="text-gray-400 text-center py-4">No comments yet. Be the first to comment!</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <ProfileEditModal
          trader={currentTrader}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </>
  );
};