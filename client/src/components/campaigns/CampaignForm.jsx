import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, Calendar, Tag, Users, DollarSign, Megaphone } from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import Textarea from '../common/Textarea';
import Button from '../common/Button';
import Card from '../common/Card';
import Alert from '../common/Alert';

const CATEGORIES = [
  'Technology',
  'E-commerce',
  'Healthcare',
  'Education',
  'Entertainment',
  'Fashion',
  'Finance',
  'Food & Beverage',
  'Travel',
  'Other'
];

const STATUSES = [
  { value: 'draft', label: 'Draft (Private)' },
  { value: 'active', label: 'Active (Public)' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' }
];

const CampaignForm = ({
  initialData = {},
  onSubmit,
  isLoading = false,
  isEdit = false
}) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Technology',
    description: '',
    promotionalContent: '',
    imageUrl: '',
    targetAudience: '',
    startDate: '',
    endDate: '',
    status: 'draft',
    budget: 0
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        title: initialData.title || '',
        category: initialData.category || 'Technology',
        description: initialData.description || '',
        promotionalContent: initialData.promotionalContent || '',
        imageUrl: initialData.imageUrl || '',
        targetAudience: initialData.targetAudience || '',
        startDate: initialData.startDate ? initialData.startDate.substring(0, 10) : '',
        endDate: initialData.endDate ? initialData.endDate.substring(0, 10) : '',
        status: initialData.status || 'draft',
        budget: initialData.budget || 0
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.promotionalContent.trim()) {
      newErrors.promotionalContent = 'Promotional content or coupon details are required';
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Banner image URL is required';
    } else {
      try {
        new URL(formData.imageUrl);
      } catch (_) {
        newErrors.imageUrl = 'Must be a valid web URL (e.g. https://...)';
      }
    }

    if (!formData.targetAudience.trim()) {
      newErrors.targetAudience = 'Target audience is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validate()) return;

    try {
      await onSubmit({
        ...formData,
        budget: Number(formData.budget) || 0
      });
    } catch (err) {
      if (err.validationErrors && err.validationErrors.length > 0) {
        const fieldErrors = {};
        err.validationErrors.forEach((item) => {
          fieldErrors[item.field] = item.message;
        });
        setErrors(fieldErrors);
      } else {
        setGeneralError(err.message || 'Failed to save campaign');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {generalError && (
        <Alert
          type="error"
          message={generalError}
          onClose={() => setGeneralError('')}
        />
      )}

      {/* Main Campaign Information Card */}
      <Card>
        <h4 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-brand-600" />
          Campaign Overview
        </h4>

        <div className="space-y-4">
          <Input
            label="Campaign Headline / Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Summer Flash Sale — Up to 50% Off"
            error={errors.title}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Industry / Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={CATEGORIES}
              error={errors.category}
              required
            />

            <Select
              label="Campaign Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={STATUSES}
              error={errors.status}
              required
            />
          </div>

          <Textarea
            label="Campaign Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Provide a compelling overview of what makes this campaign or deal special..."
            error={errors.description}
            required
          />

          <Textarea
            label="Promotional Content & Offer Details"
            name="promotionalContent"
            value={formData.promotionalContent}
            onChange={handleChange}
            rows={3}
            placeholder="e.g., Promo Code: PROMO2026. Free shipping on orders over $50. Valid at checkout."
            helperText="Include discount codes, coupon instructions, and redemption links."
            error={errors.promotionalContent}
            required
          />
        </div>
      </Card>

      {/* Media & Audience Card */}
      <Card>
        <h4 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
          <Image className="w-5 h-5 text-brand-600" />
          Creative Media & Targeting
        </h4>

        <div className="space-y-4">
          <div>
            <Input
              label="Banner Image URL"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/photo-..."
              helperText="Paste a high-resolution image link to showcase your promotion."
              error={errors.imageUrl}
              required
            />

            {/* Live Image Preview */}
            {formData.imageUrl && (
              <div className="mt-3 relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 h-44 flex items-center justify-center">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                  onLoad={(e) => {
                    e.target.style.display = 'block';
                  }}
                />
                <span className="absolute bottom-2 right-2 bg-slate-900/70 backdrop-blur-md text-white text-[11px] font-medium px-2 py-0.5 rounded">
                  Live Preview
                </span>
              </div>
            )}
          </div>

          <Input
            label="Target Audience"
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleChange}
            placeholder="e.g., Remote software developers, ecommerce shoppers aged 20-35"
            error={errors.targetAudience}
            icon={Users}
            required
          />
        </div>
      </Card>

      {/* Schedule & Budget Card */}
      <Card>
        <h4 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-600" />
          Timeline & Budget
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            error={errors.startDate}
            required
          />

          <Input
            label="End Date"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            error={errors.endDate}
            required
          />

          <Input
            label="Budget Allocation ($)"
            name="budget"
            type="number"
            min="0"
            step="10"
            value={formData.budget}
            onChange={handleChange}
            icon={DollarSign}
            error={errors.budget}
          />
        </div>
      </Card>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="shadow-md"
        >
          {isEdit ? 'Update Campaign' : 'Publish Campaign'}
        </Button>
      </div>
    </form>
  );
};

export default CampaignForm;
